<script setup>
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import ToggleSwitch from 'primevue/toggleswitch'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { useAlertsStore } from '../../application/alerts.store.js'

const { t } = useI18n()
const store = useAlertsStore()
const draft = ref({})
const saved = ref(false)
const noChannel = ref(false)
const failed = ref(false)

const toDraft = () =>
  Object.fromEntries(store.channels.map((c) => [c.id, c.active]))

watch(
  () => store.channels,
  () => { draft.value = toDraft() },
  { immediate: true }
)

onMounted(store.fetchChannels)

function toggle(id, active) {
  draft.value = { ...draft.value, [id]: active }
  saved.value = false
  noChannel.value = false
}

function reset() {
  draft.value = toDraft()
  noChannel.value = false
}

async function save() {
  saved.value = false
  failed.value = false

  const changes = Object.entries(draft.value).map(([id, active]) => ({
    id: Number(id),
    active,
  }))

  if (!changes.some((c) => c.active)) {
    noChannel.value = true
    return
  }

  const result = await store.saveChannels(changes)

  if (result.ok) saved.value = true
  else if (result.error.code === 'AT_LEAST_ONE_CHANNEL') {
    noChannel.value = true
  } else {
    failed.value = true
  }
}
</script>

<template>
  <section aria-labelledby="settings-title">
    <PageHeader
      :title="t('alerts.notificationSettings.title')"
      title-id="settings-title"
    />

    <AlertBanner v-if="saved" tone="success">
      {{ t('alerts.notificationSettings.saved') }}
    </AlertBanner>

    <AlertBanner v-if="noChannel" tone="error">
      {{ t('alerts.notificationSettings.atLeastOne') }}
    </AlertBanner>

    <AlertBanner v-if="store.error || failed" tone="error">
      {{ t('shared.error') }}
    </AlertBanner>

    <ProgressBar
      v-if="store.loading && !store.channels.length"
      mode="indeterminate"
      style="height: 4px"
      :aria-label="t('alerts.notificationSettings.title')"
    />

    <div v-if="store.channels.length" class="ss-card ss-form">
      <h2 class="h2">
        {{ t('alerts.notificationSettings.heading') }}
      </h2>

      <p class="ss-muted">
        {{ t('alerts.notificationSettings.text') }}
      </p>

      <div v-for="c in store.channels" :key="c.id" class="channel">
        <div>
          <strong :id="`channel-${c.id}-label`">
            {{ t(`alerts.notificationSettings.${c.channel}`) }}
          </strong>
          <div class="ss-muted">{{ c.destination }}</div>
        </div>

        <ToggleSwitch
          :input-id="`channel-${c.id}`"
          :model-value="draft[c.id]"
          :aria-labelledby="`channel-${c.id}-label`"
          @update:model-value="toggle(c.id, $event)"
        />
      </div>

      <p class="ss-note">
        {{ t('alerts.notificationSettings.hint') }}
      </p>

      <div class="ss-actions">
        <Button
          :label="t('shared.cancel')"
          severity="secondary"
          text
          @click="reset"
        />
        <Button
          :label="t('alerts.notificationSettings.save')"
          :disabled="store.loading"
          @click="save"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.h2 {
  font-size: 1.05rem;
  margin: 0 0 0.25rem;
}

.channel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid var(--p-content-border-color);
}
</style>