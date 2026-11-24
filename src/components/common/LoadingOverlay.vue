<template>
  <div v-if="loading" class="d-flex justify-center align-center" :style="{ minHeight }">
    <div class="text-center">
      <v-progress-circular indeterminate color="primary" :size="size" :width="3" />
      <p v-if="text" class="text-body-2 text-medium-emphasis mt-3">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading: boolean
    text?: string
    minHeight?: string
    size?: number
  }>(),
  {
    text: 'Loading...',
    minHeight: '200px',
    size: 44,
  },
)
</script>
