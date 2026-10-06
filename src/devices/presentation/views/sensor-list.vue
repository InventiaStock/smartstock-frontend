<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import StatusTag from '../../../shared/presentation/components/status-tag.vue'
import SummaryCard from '../../../shared/presentation/components/summary-card.vue'
import { useDevicesStore } from '../../application/devices.store.js'

// US06 · M31 sensors: status, last reading and current weight
const { t } = useI18n()
const store = useDevicesStore()
onMounted(store.fetchSensors)
</script>

<template>
  <section aria-labelledby="sensors-title">
    <PageHeader :title="t('devices.sensorList.title')" title-id="sensors-title">
      <router-link to="/sensors/link" custom v-slot="{ navigate }">
        <Button :label="t('devices.sensorList.link')" icon="pi pi-link" @click="navigate" />
      </router-link>
    </PageHeader>

    <div class="ss-grid" role="group" :aria-label="t('devices.sensorList.title')">
      <SummaryCard :label="t('shared.status.online')" :value="String(store.online)" />
      <SummaryCard :label="t('shared.status.disconnected')" :value="String(store.disconnected)" />
      <SummaryCard :label="t('devices.sensorList.availableToLink')" :value="String(store.available)" />
    </div>

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="store.fetchSensors" />
    </AlertBanner>

    <DataTable :value="store.sensors" :loading="store.loading" data-key="id" size="small">
      <template #empty><EmptyState :message="t('devices.sensorList.empty')" /></template>
      <Column :header="t('devices.sensorList.sensor')">
        <template #body="{ data }"><strong>{{ data.code }}</strong></template>
      </Column>
      <Column :header="t('devices.sensorList.product')">
        <template #body="{ data }">{{ data.productName ?? t('shared.status.notLinked') }}</template>
      </Column>
      <Column :header="t('devices.sensorList.status')">
        <template #body="{ data }"><StatusTag :status="data.status" /></template>
      </Column>
      <Column :header="t('devices.sensorList.lastReading')">
        <template #body="{ data }">
          {{ data.minutesSinceReading === null ? '—' : t('shared.minutesAgo', { count: data.minutesSinceReading }) }}
        </template>
      </Column>
      <Column :header="t('devices.sensorList.weight')">
        <template #body="{ data }">
          <template v-if="data.isAvailable">—</template>
          <template v-else>{{ data.weightKg.toFixed(2) }} kg ≈ {{ data.units }} {{ t('shared.units') }}</template>
        </template>
      </Column>
      <Column header="">
        <template #body="{ data }">
          <router-link v-if="data.isAvailable" :to="{ path: '/sensors/link', query: { sensorId: data.id } }" custom v-slot="{ navigate }">
            <Button :label="t('devices.sensorList.linkRow')" size="small" severity="secondary" outlined @click="navigate" />
          </router-link>
          <router-link v-else :to="`/sensors/${data.id}/threshold`" custom v-slot="{ navigate }">
            <Button :label="t('devices.sensorList.configure')" size="small" severity="secondary" outlined @click="navigate" />
          </router-link>
        </template>
      </Column>
    </DataTable>
    <p class="ss-note">{{ t('devices.sensorList.note') }}</p>
  </section>
</template>