<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="text-subtitle-1 font-weight-medium">Transfer History</span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="canRequestTransfer"
        color="primary"
        size="small"
        prepend-icon="mdi-swap-horizontal"
        @click="$emit('request-transfer')"
        class="mr-2"
      >
        Request Transfer
      </v-btn>
      <v-btn variant="outlined" size="small" prepend-icon="mdi-refresh" @click="loadData" :loading="loading">
        Refresh
      </v-btn>
    </v-card-title>
    
    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="pagination.totalElements.value"
      :items-per-page="pagination.size.value"
      :page="pagination.displayPage.value"
      :loading="loading"
      :items-per-page-options="pagination.itemsPerPageOptions"
      @update:page="onPageUpdate"
      @update:items-per-page="onSizeUpdate"
    >
      <template #item.status="{ item }">
        <StatusChip :status="item.status" size="small" />
      </template>
      <template #item.effectiveFrom="{ item }">
        {{ formatDateTime(item.effectiveFrom) }}
      </template>
      <template #item.requestedAt="{ item }">
        {{ formatDateTime(item.requestedAt) }}
      </template>
      <template #item.completedAt="{ item }">
        {{ item.completedAt ? formatDateTime(item.completedAt) : '—' }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          v-if="canDecide(item)"
          color="primary"
          variant="text"
          size="small"
          @click="$emit('decide', item)"
        >
          Review
        </v-btn>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import StatusChip from '@/components/common/StatusChip.vue'
import { getTransfers } from '@/services/transfer.service'
import { usePagination } from '@/composables/usePagination'
import { useAuthStore } from '@/stores/auth.store'
import { formatDateTime } from '@/utils/date'
import type { TransferResponse } from '@/types/transfer'

const props = defineProps<{
  agentId: string
  agentStatus: string
}>()

const emit = defineEmits<{
  (e: 'request-transfer'): void
  (e: 'decide', transfer: TransferResponse): void
}>()

const pagination = usePagination()
const authStore = useAuthStore()
const loading = ref(false)
const items = ref<TransferResponse[]>([])

const canRequestTransfer = computed(() => {
  return props.agentStatus === 'ACTIVE' && authStore.hasAnyRole(['ROLE_BRANCH_USER', 'ROLE_ADMIN'])
})

function canDecide(transfer: TransferResponse) {
  return transfer.status === 'PENDING' && authStore.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN'])
}

const headers = [
  { title: 'Source', key: 'sourceBranchCode', sortable: false },
  { title: 'Destination', key: 'destinationBranchCode', sortable: false },
  { title: 'Effective From', key: 'effectiveFrom', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Reason', key: 'reason', sortable: false },
  { title: 'Requested By', key: 'requestedBy', sortable: false },
  { title: 'Requested At', key: 'requestedAt', sortable: false },
  { title: 'Completed At', key: 'completedAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  if (!props.agentId) return
  loading.value = true
  try {
    const response = await getTransfers(props.agentId, pagination.page.value, pagination.size.value)
    const data = response.data.data
    items.value = data.content
    pagination.updateFromResponse(data)
  } catch (e) {
    console.error('Failed to load transfers', e)
  } finally {
    loading.value = false
  }
}

function onPageUpdate(newPage: number) {
  pagination.onPageChange(newPage)
  loadData()
}

function onSizeUpdate(newSize: number) {
  pagination.onSizeChange(newSize)
  loadData()
}

onMounted(() => loadData())

defineExpose({ refresh: loadData })
</script>
