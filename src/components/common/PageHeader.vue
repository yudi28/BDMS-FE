<template>
  <div class="page-header mb-6">
    <v-breadcrumbs v-if="breadcrumbs.length > 0" :items="breadcrumbs" density="compact" class="px-0">
      <template #divider>
        <v-icon icon="mdi-chevron-right" size="small" />
      </template>
    </v-breadcrumbs>
    <div class="d-flex align-center justify-space-between flex-wrap ga-2">
      <div>
        <h1 class="text-h5 font-weight-bold">{{ title }}</h1>
        <p v-if="subtitle" class="text-body-2 text-medium-emphasis mt-1">{{ subtitle }}</p>
      </div>
      <div class="d-flex ga-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  title: string
  to?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    breadcrumbs?: BreadcrumbItem[]
  }>(),
  {
    subtitle: undefined,
    breadcrumbs: () => [],
  },
)
</script>
