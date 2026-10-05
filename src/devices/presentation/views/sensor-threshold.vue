<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import ProgressBar from 'primevue/progressbar'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { useCatalogStore } from '../../../catalog/application/catalog.store.js'

// US05 · M34 minimum threshold, M35 threshold above the maximum capacity (R7)
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useCatalogStore()
const sensorId = Number(route.params.id)

// shows the current threshold when the data arrives
const threshold = ref(null)
const message = ref('')

watch(
    () => store.target,
    (target) => {
      if (target) {
        threshold.value = target.minThreshold
      }
    }
)

onMounted(() =>
    store.fetchThresholdTarget(sensorId)
)

async function save(maxCapacity) {
  const value = Number(threshold.value)
  message.value = ''

  // Same rule as the backend:
  // greater than 0 and not above the maximum capacity (R7)
  if (
      !(value > 0) ||
      value > maxCapacity
  ) {
    message.value =
        t(
            'catalog.sensorThreshold.exceeds',
            { max: maxCapacity }
        )

    return
  }

  const result =
      await store.saveThreshold(
          sensorId,
          value
      )

  if (result.ok) {
    return router.push('/sensors')
  }

  message.value =
      t(
          'catalog.sensorThreshold.exceeds',
          {
            max:
                result.error.maxCapacity ??
                maxCapacity
          }
      )
}
</script>

<template>
  <section aria-labelledby="threshold-title">
    <PageHeader
        :title="t('catalog.sensorThreshold.title')"
        title-id="threshold-title"
    />

    <ProgressBar
        v-if="store.loading && !store.target"
        mode="indeterminate"
        style="height: 6px"
        :aria-label="t('shared.loading')"
    />

    <AlertBanner
        v-if="store.error"
        tone="error"
    >
      {{ t('shared.error') }}
    </AlertBanner>

    <div
        v-if="store.target"
        class="ss-card ss-form"
    >
      <AlertBanner
          v-if="message"
          tone="error"
      >
        {{
          t(
              'catalog.sensorThreshold.bannerExceeds'
          )
        }}
      </AlertBanner>

      <dl class="meta">
        <div>
          <dt>
            {{
              t(
                  'catalog.sensorThreshold.product'
              )
            }}
          </dt>

          <dd>
            {{ store.target.name }}
          </dd>
        </div>

        <div>
          <dt>
            {{
              t(
                  'catalog.sensorThreshold.maxCapacity'
              )
            }}
          </dt>

          <dd>
            {{ store.target.maxCapacity }}
            {{ t('shared.units') }}
          </dd>
        </div>
      </dl>

      <FormField
          id="threshold"
          :label="t('catalog.sensorThreshold.field')"
          :error="message"
      >
        <InputNumber
            v-model="threshold"
            input-id="threshold"
            :min="1"
            :max-fraction-digits="0"
            :invalid="!!message"
            fluid
            :pt="{
            pcInputText: {
              root: {
                'aria-invalid': !!message,
                'aria-describedby':
                  message
                    ? 'threshold-error'
                    : 'threshold-help'
              }
            }
          }"
        />
      </FormField>

      <p
          id="threshold-help"
          class="ss-note"
      >
        {{
          t(
              'catalog.sensorThreshold.help',
              {
                max:
                store.target.maxCapacity
              }
          )
        }}
      </p>

      <div class="ss-actions">
        <router-link
            to="/sensors"
            custom
            v-slot="{ navigate }"
        >
          <Button
              type="button"
              :label="t('shared.cancel')"
              text
              @click="navigate"
          />
        </router-link>

        <Button
            type="button"
            :label="t('catalog.sensorThreshold.save')"
            :loading="store.loading"
            @click="
            save(
              store.target.maxCapacity
            )
          "
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.meta {
  display: grid;
  gap: 0.75rem;
  margin: 0 0 1rem;
}

dt {
  color: var(--p-text-muted-color);
  font-size: 0.8rem;
  text-transform: uppercase;
}

dd {
  margin: 0;
  font-weight: 600;
}
</style>