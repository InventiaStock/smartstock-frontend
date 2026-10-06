<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import Money from '../../../shared/presentation/components/money.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import StatusTag from '../../../shared/presentation/components/status-tag.vue'
import { usePurchasesStore } from '../../application/purchases.store.js'

// US30 · M5 / M5A pending purchase, M6 / M6A received purchase with its IN movements
const { t, locale } = useI18n()
const route = useRoute()
const store = usePurchasesStore()
const id = route.params.id
const failed = ref(false)

const statusKey = (status) =>
    status === 'RECEIVED'
        ? 'received'
        : status === 'CANCELLED'
            ? 'cancelled'
            : 'pending'

const mediumDate = (value) =>
    new Date(
        value.length === 10
            ? `${value}T00:00:00`
            : value
    ).toLocaleDateString(
        locale.value,
        { dateStyle: 'medium' }
    )

onMounted(() => store.fetchPurchase(id))

async function receive() {
  failed.value = false

  const result = await store.receive(id)

  if (result.ok) {
    store.fetchPurchase(id)
  } else {
    failed.value = true
  }
}
</script>

<template>
  <section aria-labelledby="purchase-page-title">
    <PageHeader
        :title="t('inventory.purchaseDetails.title')"
        title-id="purchase-page-title"
    >
      <router-link
          to="/purchases"
          custom
          v-slot="{ navigate }"
      >
        <Button
            :label="t('inventory.purchaseDetails.back')"
            outlined
            @click="navigate"
        />
      </router-link>
    </PageHeader>

    <AlertBanner
        v-if="store.error"
        tone="error"
    >
      {{ t('shared.error') }}

      <Button
          :label="t('shared.retry')"
          size="small"
          text
          @click="store.fetchPurchase(id)"
      />
    </AlertBanner>

    <AlertBanner
        v-if="failed"
        tone="error"
    >
      {{ t('inventory.purchaseDetails.receiveFailed') }}
    </AlertBanner>

    <ProgressBar
        v-if="store.loading && !store.current"
        mode="indeterminate"
        style="height: 6px"
        :aria-label="t('shared.loading')"
    />

    <template v-if="store.current">
      <div class="ss-card">
        <div class="top">
          <h2
              id="purchase-title"
              class="h2"
          >
            {{ t('inventory.purchaseDetails.purchase') }}
            {{ store.current.id }}
          </h2>

          <StatusTag
              :status="statusKey(store.current.status)"
          />

          <Button
              v-if="store.current.isPending"
              class="push"
              type="button"
              :label="t('inventory.purchaseDetails.markReceived')"
              :loading="store.loading"
              @click="receive"
          />
        </div>

        <dl class="meta">
          <div>
            <dt>
              {{ t('inventory.purchaseDetails.supplier') }}
            </dt>
            <dd>
              {{ store.current.supplierName }}
            </dd>
          </div>

          <div>
            <dt>
              {{ t('inventory.purchaseList.date') }}
            </dt>
            <dd>
              {{ mediumDate(store.current.date) }}
            </dd>
          </div>

          <div>
            <dt>
              {{ t('inventory.purchaseList.total') }}
            </dt>
            <dd>
              <Money :amount="store.current.total" />
            </dd>
          </div>
        </dl>
      </div>

      <div class="ss-card">
        <h2 class="h2">
          {{ t('inventory.purchaseNew.products') }}
        </h2>

        <div
            v-for="item in store.current.items"
            :key="item.productId"
            class="line"
        >
          <span>
            {{ item.productName }}
          </span>

          <span class="ss-muted">
            {{ item.quantity }}
            ×
            <Money :amount="item.unitCost" />
          </span>

          <strong>
            <Money :amount="item.subtotal" />
          </strong>
        </div>
      </div>

      <div class="ss-card">
        <h2 class="h2">
          {{ t('inventory.purchaseDetails.movements') }}
        </h2>

        <div
            v-for="m in store.current.movements"
            :key="m.id"
            class="line"
        >
          <Tag
              severity="secondary"
              :value="m.type"
              class="tag"
          />

          <span>
            {{ m.productName }}
          </span>

          <span>
            +{{ m.quantity }}
            {{ t('shared.units') }}
          </span>
        </div>

        <div
            v-if="!store.current.movements.length"
            role="status"
        >
          <strong>
            {{ t('inventory.purchaseDetails.noMovements') }}
          </strong>

          <p class="ss-muted">
            {{ t('inventory.purchaseDetails.noMovementsHelp') }}
          </p>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.top {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.push {
  margin-left: auto;
}

.h2 {
  font-size: 1.05rem;
  margin: 0 0 0.75rem;
}

.top .h2 {
  margin: 0;
}

.meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 1rem 0 0;
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

.line {
  display: grid;
  grid-template-columns: 1fr 1fr 120px;
  gap: 0.5rem;
  padding: 0.4rem 0;
  align-items: center;
}

.tag {
  width: max-content;
}
</style>