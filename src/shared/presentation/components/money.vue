<script setup>
import { computed } from 'vue'
import { formatPen } from '../../domain/model/money.js'

const props = defineProps({ amount: { type: Number, required: true } })
const text = computed(() => formatPen(props.amount))
</script>

<template>
  <span class="money">{{ text }}</span>
</template>
