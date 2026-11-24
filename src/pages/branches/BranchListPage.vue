<template>
  <div>
    <PageHeader title="Branches" subtitle="Manage branch offices">
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">New Branch</v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="loadData" :loading="loading">Refresh</v-btn>
      </template>
    </PageHeader>
    <v-card>
      <v-data-table-server
        :headers="headers" :items="items" :items-length="pagination.totalElements.value"
        :items-per-page="pagination.size.value" :page="pagination.displayPage.value"
        :loading="loading" :items-per-page-options="pagination.itemsPerPageOptions"
        @update:page="onPageUpdate" @update:items-per-page="onSizeUpdate"
      >
        <template #item.status="{ item }"><StatusChip :status="item.status" size="small" /></template>
        <template #item.createdAt="{ item }">{{ formatDateTime(item.createdAt) }}</template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/branches/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEditDialog(item)" />
        </template>
        <template #no-data><EmptyState title="No Branches" message="No branches found." icon="mdi-office-building-outline" /></template>
      </v-data-table-server>
    </v-card>
    <BranchFormDialog ref="formDialog" @saved="loadData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import BranchFormDialog from './BranchFormDialog.vue'
import { getBranches } from '@/services/branch.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { BranchResponse } from '@/types/branch'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<BranchResponse[]>([])
const formDialog = ref<InstanceType<typeof BranchFormDialog>>()

const headers = [
  { title: 'Code', key: 'code', sortable: false },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Bank', key: 'bankName', sortable: false },
  { title: 'Area', key: 'areaName', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Address', key: 'address', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  loading.value = true
  try {
    const response = await getBranches(pagination.page.value, pagination.size.value)
    const data = response.data.data
    items.value = data.content
    pagination.updateFromResponse(data)
  } catch { appStore.showError('Failed to load branches') }
  finally { loading.value = false }
}

function onPageUpdate(p: number) { pagination.onPageChange(p); loadData() }
function onSizeUpdate(s: number) { pagination.onSizeChange(s); loadData() }
function openCreateDialog() { formDialog.value?.openCreate() }
function openEditDialog(b: BranchResponse) { formDialog.value?.openEdit(b) }

onMounted(() => loadData())
</script>
