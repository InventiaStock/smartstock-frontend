<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import { useIamStore } from '../../../iam/application/iam.store.js'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { useAlertsStore } from '../../application/alerts.store.js'

const SUGGESTED_QUANTITY = 10

const { t } = useI18n()
const store = useAlertsStore()
const iam = useIamStore()
const router = useRouter()

onMounted(store.fetchAlerts)

function registerPurchase(alert) {
  router.push({
    path: '/purchases/new',
    query: {
      productId: alert.productId,
      quantity: SUGGESTED_QUANTITY,
      needId: alert.restockingNeedId,
    },
  })
}
</script>

<template>
  <section aria-labelledby="alerts-title">
    <PageHeader
      :title="t('alerts.alertList.title')"
      title-id="alerts-title"
    />

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button
        :label="t('shared.retry')"
        size="small"
        text
        @click="store.fetchAlerts"
      />
    </AlertBanner>

    <ProgressBar
      v-if="store.loading"
      mode="indeterminate"
      style="height: 4px"
      :aria-label="t('alerts.alertList.title')"
    />

    <AlertBanner
      v-for="a in store.resolved"
      :key="a.id"
      tone="success"
    >
      {{
        t('alerts.alertList.resolved', {
          name: a.productName,
          stock: a.currentStock,
          threshold: a.minThreshold,
        })
      }}
      <Button
        :label="t('alerts.alertList.dismiss')"
        size="small"
        text
        @click="store.dismiss(a.id)"
      />
    </AlertBanner>

    <h2 id="alerts-active" class="h2">
      {{ t('alerts.alertList.active') }}
      <span class="count">{{ store.active.length }}</span>
    </h2>

    <article
      v-for="a in store.active"
      :key="a.id"
      class="ss-card alert"
      :aria-label="a.productName"
    >
      <div class="main">
        <strong class="type" :class="{ disc: !a.isLowStock }">
          {{ a.type }}
        </strong>

        <h3 class="name">{{ a.productName }}</h3>

        <p v-if="a.isLowStock" class="ss-muted">
          {{
            t('alerts.alertList.reference', {
              count: a.referenceStock,
            })
          }}
          ·
          <template
            v-if="a.source === 'sensor' && a.minutesSinceReading !== null"
          >
            {{
              t('alerts.alertList.sensorUpdated', {
                count: a.minutesSinceReading,
              })
            }}
          </template>
          <template v-else>
            {{ t('alerts.alertList.registeredUsed') }}
          </template>
        </p>

        <p v-else class="ss-muted">
          {{
            t('alerts.alertList.discrepancy', {
              registered: a.registeredStock,
              physical: a.physicalStock,
              diff: a.differencePct,
            })
          }}
        </p>
      </div>

      <Button
        v-if="a.isLowStock"
        :label="t('alerts.alertList.registerPurchase')"
        @click="registerPurchase(a)"
      />

      <router-link
        v-else-if="iam.businessType === 'minimarket'"
        to="/comparison"
        custom
        v-slot="{ navigate }"
      >
        <Button
          :label="t('alerts.alertList.viewComparison')"
          severity="secondary"
          outlined
          @click="navigate"
        />
      </router-link>
    </article>

    <EmptyState
      v-if="!store.active.length && !store.loading"
      :message="t('alerts.alertList.empty')"
    />
  </section>
</template>

<style scoped>
.h2 {
  font-size: 1.05rem;
  margin: 1rem 0;
}

.count {
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  border-radius: 1rem;
  padding: 0 0.6rem;
  margin-left: 0.4rem;
}

.alert {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.type {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  background: var(--p-red-50);
  color: var(--p-red-700);
  border-radius: 0.4rem;
  padding: 0.1rem 0.5rem;
}

.type.disc {
  background: var(--p-orange-50);
  color: var(--p-orange-700);
}

.name {
  margin: 0.4rem 0 0.2rem;
  font-size: 1.05rem;
  font-weight: 600;
}

p {
  margin: 0;
}
</style>