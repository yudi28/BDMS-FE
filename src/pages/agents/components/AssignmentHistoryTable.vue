<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="text-subtitle-1 font-weight-medium">Assignment History</span>
      <v-spacer></v-spacer>
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
      <template #item.effectiveTo="{ item }">
        {{ item.effectiveTo ? formatDateTime(item.effectiveTo) : '—' }}
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-eye" variant="text" size="small" :to="`/agents/${agentId}/assignments/${item.id}`" />
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatusChip from '@/components/common/StatusChip.vue'
import { getAssignments } from '@/services/assignment.service'
import { usePagination } from '@/composables/usePagination'
import { formatDateTime } from '@/utils/date'
import type { AssignmentResponse } from '@/types/assignment'

const props = defineProps<{
  agentId: string
}>()

const emit = defineEmits<{
  (e: 'update:activeAssignment', assignment: AssignmentResponse | null): void
}>()

const pagination = usePagination()
const loading = ref(false)
const items = ref<AssignmentResponse[]>([])

const headers = [
  { title: 'Branch Code', key: 'branchCode', sortable: false },
  { title: 'Branch Name', key: 'branchName', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Type', key: 'assignmentType', sortable: false },
  { title: 'Effective From', key: 'effectiveFrom', sortable: false },
  { title: 'Effective To', key: 'effectiveTo', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  if (!props.agentId) return
  loading.value = true
  try {
    const response = await getAssignments(props.agentId, pagination.page.value, pagination.size.value)
    const data = response.data.data
    items.value = data.content
    pagination.updateFromResponse(data)
    
    const active = items.value.find(i => i.status === 'ACTIVE') || null
    emit('update:activeAssignment', active)
  } catch (e) {
    console.error('Failed to load assignments', e)
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
