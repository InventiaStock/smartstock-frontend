<script setup>
import StatusTag from './status-tag.vue'

// level: lowStock | healthy | noData (the label always has text, not only color)
defineProps({ level: { type: String, required: true } })
</script>

<template>
  <status-tag :status="level" />
</template>
