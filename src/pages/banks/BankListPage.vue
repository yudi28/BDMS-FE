<template>
  <div>
    <PageHeader title="Banks" subtitle="Manage bank partners">
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">New Bank</v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="loadData" :loading="loading">Refresh</v-btn>
      </template>
    </PageHeader>
    <v-card>
      <v-data-table-server :headers="headers" :items="items" :items-length="pagination.totalElements.value"
        :items-per-page="pagination.size.value" :page="pagination.displayPage.value" :loading="loading"
        :items-per-page-options="pagination.itemsPerPageOptions" @update:page="onPageUpdate" @update:items-per-page="onSizeUpdate">
        <template #item.status="{ item }"><StatusChip :status="item.status" size="small" /></template>
        <template #item.createdAt="{ item }">{{ formatDateTime(item.createdAt) }}</template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/banks/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEditDialog(item)" />
        </template>
        <template #no-data><EmptyState title="No Banks" message="No banks found." icon="mdi-bank-outline" /></template>
      </v-data-table-server>
    </v-card>
    <BankFormDialog ref="formDialog" @saved="loadData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import BankFormDialog from './BankFormDialog.vue'
import { getBanks } from '@/services/bank.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { BankResponse } from '@/types/bank'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<BankResponse[]>([])
const formDialog = ref<InstanceType<typeof BankFormDialog>>()

const headers = [
  { title: 'Code', key: 'code', sortable: false },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  loading.value = true
  try { const r = await getBanks(pagination.page.value, pagination.size.value); items.value = r.data.data.content; pagination.updateFromResponse(r.data.data) }
  catch { appStore.showError('Failed to load banks') } finally { loading.value = false }
}
function onPageUpdate(p: number) { pagination.onPageChange(p); loadData() }
function onSizeUpdate(s: number) { pagination.onSizeChange(s); loadData() }
function openCreateDialog() { formDialog.value?.openCreate() }
function openEditDialog(b: BankResponse) { formDialog.value?.openEdit(b) }
onMounted(() => loadData())
</script>
