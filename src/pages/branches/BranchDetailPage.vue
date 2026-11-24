<template>
  <div>
    <LoadingOverlay :loading="loading" />
    <template v-if="!loading && branch">
      <PageHeader :title="branch.name" :subtitle="`Code: ${branch.code}`"
        :breadcrumbs="[{ title: 'Branches', to: '/branches' }, { title: branch.name, disabled: true }]">
        <template #actions><v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/branches">Back</v-btn></template>
      </PageHeader>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-list lines="two" density="compact">
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Code</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ branch.code }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Name</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ branch.name }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Bank</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ branch.bankName }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Area</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ branch.areaName }}</v-list-item-subtitle></v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list lines="two" density="compact">
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Address</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ branch.address || '—' }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title><v-list-item-subtitle><StatusChip :status="branch.status" /></v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(branch.createdAt) }}</v-list-item-subtitle></v-list-item>
                <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Updated</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(branch.updatedAt) }}</v-list-item-subtitle></v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
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
import { getBranch } from '@/services/branch.service'
import { formatDateTime } from '@/utils/date'
import type { BranchResponse } from '@/types/branch'

const route = useRoute()
const loading = ref(true)
const branch = ref<BranchResponse | null>(null)
const errorMessage = ref('')

async function loadData() {
  loading.value = true
  try { const r = await getBranch(route.params.id as string); branch.value = r.data.data }
  catch { errorMessage.value = 'Failed to load branch details' }
  finally { loading.value = false }
}
onMounted(() => loadData())
</script>
