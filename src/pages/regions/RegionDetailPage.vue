<template>
  <div>
    <LoadingOverlay :loading="loading" />
    <template v-if="!loading && region">
      <PageHeader :title="region.name" :subtitle="`Code: ${region.code}`"
        :breadcrumbs="[{ title: 'Regions', to: '/regions' }, { title: region.name, disabled: true }]">
        <template #actions><v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/regions">Back</v-btn></template>
      </PageHeader>
      <v-card><v-card-text>
        <v-list lines="two" density="compact">
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Code</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ region.code }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Name</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ region.name }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Bank</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ region.bankName }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title><v-list-item-subtitle><StatusChip :status="region.status" /></v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(region.createdAt) }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Updated</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(region.updatedAt) }}</v-list-item-subtitle></v-list-item>
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
import { getRegion } from '@/services/region.service'
import { formatDateTime } from '@/utils/date'
import type { RegionResponse } from '@/types/region'

const route = useRoute()
const loading = ref(true)
const region = ref<RegionResponse | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  try { region.value = (await getRegion(route.params.id as string)).data.data }
  catch { errorMessage.value = 'Failed to load region details' } finally { loading.value = false }
})
</script>
