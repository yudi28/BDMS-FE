<template>
  <div class="empty-state text-center py-12">
    <v-icon :icon="icon" size="64" color="grey-lighten-1" class="mb-4" />
    <h3 class="text-h6 text-medium-emphasis mb-2">{{ title }}</h3>
    <p class="text-body-2 text-disabled">{{ message }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
    icon?: string
  }>(),
  {
    title: 'No Data',
    message: 'No records found.',
    icon: 'mdi-database-off-outline',
  },
)
</script>
