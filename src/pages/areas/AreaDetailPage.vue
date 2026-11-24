<template>
  <div>
    <LoadingOverlay :loading="loading" />
    <template v-if="!loading && area">
      <PageHeader :title="area.name" :subtitle="`Code: ${area.code}`"
        :breadcrumbs="[{ title: 'Areas', to: '/areas' }, { title: area.name, disabled: true }]">
        <template #actions><v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/areas">Back</v-btn></template>
      </PageHeader>
      <v-card><v-card-text>
        <v-list lines="two" density="compact">
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Code</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ area.code }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Name</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ area.name }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Region</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ area.regionName }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title><v-list-item-subtitle><StatusChip :status="area.status" /></v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(area.createdAt) }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Updated</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(area.updatedAt) }}</v-list-item-subtitle></v-list-item>
        </v-list>
      </v-card-text></v-card>
    </template>
    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">{{ errorMessage }}</v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { getArea } from '@/services/area.service'
import { formatDateTime } from '@/utils/date'
import type { AreaResponse } from '@/types/area'

const route = useRoute()
const loading = ref(true)
const area = ref<AreaResponse | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  try { area.value = (await getArea(route.params.id as string)).data.data }
  catch { errorMessage.value = 'Failed to load area details' } finally { loading.value = false }
})
</script>
