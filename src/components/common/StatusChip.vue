<template>
  <v-chip
    :color="getStatusColor(status)"
    :size="size"
    variant="tonal"
    label
  >
    {{ formatStatus(status) }}
  </v-chip>
</template>

<script setup lang="ts">
import { getStatusColor, formatStatus } from '@/utils/status'

defineProps<{
  status: string | null | undefined
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()
</script>
