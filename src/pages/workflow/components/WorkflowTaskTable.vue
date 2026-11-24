<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span class="text-subtitle-1 font-weight-medium">Workflow Tasks</span>
      <v-spacer></v-spacer>
      <v-select
        v-model="statusFilter"
        :items="statusOptions"
        label="Status"
        density="compact"
        hide-details
        class="mr-4"
        style="max-width: 200px"
        clearable
        @update:model-value="onFilterChange"
      ></v-select>
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
      <template #item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
      <template #item.claimedAt="{ item }">
        {{ item.claimedAt ? formatDateTime(item.claimedAt) : '—' }}
      </template>
      <template #item.completedAt="{ item }">
        {{ item.completedAt ? formatDateTime(item.completedAt) : '—' }}
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-eye" variant="text" size="small" :to="`/workflow/tasks/${item.id}`" />
      </template>
      
      <template #no-data>
        <EmptyState title="No Tasks" message="Your task inbox is empty." icon="mdi-inbox" />
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatusChip from '@/components/common/StatusChip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getMyTasks } from '@/services/workflow.service'
import { usePagination } from '@/composables/usePagination'
import { formatDateTime } from '@/utils/date'
import type { WorkflowTaskResponse } from '@/types/workflow'

const pagination = usePagination()
const loading = ref(false)
const items = ref<WorkflowTaskResponse[]>([])

const statusOptions = ['PENDING', 'CLAIMED', 'APPROVED', 'REJECTED', 'CANCELLED']
const statusFilter = ref<string | null>(null)

const headers = [
  { title: 'Workflow Type', key: 'workflowType', sortable: false },
  { title: 'Task Type', key: 'taskType', sortable: false },
  { title: 'Entity Type', key: 'entityType', sortable: false },
  { title: 'Entity ID', key: 'entityId', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Assigned Role', key: 'assignedRole', sortable: false },
  { title: 'Created At', key: 'createdAt', sortable: false },
  { title: 'Claimed At', key: 'claimedAt', sortable: false },
  { title: 'Completed At', key: 'completedAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  loading.value = true
  try {
    const response = await getMyTasks(pagination.page.value, pagination.size.value, statusFilter.value || undefined)
    const data = response.data.data
    items.value = data.content
    pagination.updateFromResponse(data)
  } catch (e) {
    console.error('Failed to load tasks', e)
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

function onFilterChange() {
  pagination.onPageChange(1)
  loadData()
}

onMounted(() => loadData())

defineExpose({ refresh: loadData })
</script>
