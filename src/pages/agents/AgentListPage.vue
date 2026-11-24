<template>
  <div>
    <PageHeader title="Agents" subtitle="Manage insurance agents">
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
          New Agent
        </v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="loadAgents" :loading="loading">
          Refresh
        </v-btn>
      </template>
    </PageHeader>

    <v-card>
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
        <template #item.nikMasked="{ item }">
          <span class="font-weight-medium text-mono">{{ item.nikMasked }}</span>
        </template>

        <template #item.status="{ item }">
          <StatusChip :status="item.status" size="small" />
        </template>

        <template #item.createdAt="{ item }">
          {{ formatDateTime(item.createdAt) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/agents/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEditDialog(item)" />
        </template>

        <template #no-data>
          <EmptyState title="No Agents" message="No agents have been created yet." icon="mdi-account-group-outline" />
        </template>
      </v-data-table-server>
    </v-card>

    <AgentFormDialog
      ref="formDialog"
      @saved="loadAgents"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AgentFormDialog from './AgentFormDialog.vue'
import { getAgents } from '@/services/agent.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { AgentResponse } from '@/types/agent'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<AgentResponse[]>([])
const formDialog = ref<InstanceType<typeof AgentFormDialog>>()

const headers = [
  { title: 'Agent Code', key: 'agentCode', sortable: false },
  { title: 'NIK', key: 'nikMasked', sortable: false },
  { title: 'Full Name', key: 'fullName', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Phone', key: 'phone', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadAgents() {
  loading.value = true
  try {
    const response = await getAgents(pagination.page.value, pagination.size.value)
    const data = response.data.data
    items.value = data.content
    pagination.updateFromResponse(data)
  } catch {
    appStore.showError('Failed to load agents')
  } finally {
    loading.value = false
  }
}

function onPageUpdate(newPage: number) {
  pagination.onPageChange(newPage)
  loadAgents()
}

function onSizeUpdate(newSize: number) {
  pagination.onSizeChange(newSize)
  loadAgents()
}

function openCreateDialog() {
  formDialog.value?.openCreate()
}

function openEditDialog(agent: AgentResponse) {
  formDialog.value?.openEdit(agent)
}

onMounted(() => loadAgents())
</script>
