<template>
  <div>
    <PageHeader title="Regions" subtitle="Manage regional divisions">
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">New Region</v-btn>
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
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/regions/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEditDialog(item)" />
        </template>
        <template #no-data><EmptyState title="No Regions" message="No regions found." icon="mdi-map-outline" /></template>
      </v-data-table-server>
    </v-card>
    <RegionFormDialog ref="formDialog" @saved="loadData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import RegionFormDialog from './RegionFormDialog.vue'
import { getRegions } from '@/services/region.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { RegionResponse } from '@/types/region'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<RegionResponse[]>([])
const formDialog = ref<InstanceType<typeof RegionFormDialog>>()

const headers = [
  { title: 'Code', key: 'code', sortable: false },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Bank', key: 'bankName', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  loading.value = true
  try { const r = await getRegions(pagination.page.value, pagination.size.value); items.value = r.data.data.content; pagination.updateFromResponse(r.data.data) }
  catch { appStore.showError('Failed to load regions') } finally { loading.value = false }
}
function onPageUpdate(p: number) { pagination.onPageChange(p); loadData() }
function onSizeUpdate(s: number) { pagination.onSizeChange(s); loadData() }
function openCreateDialog() { formDialog.value?.openCreate() }
function openEditDialog(r: RegionResponse) { formDialog.value?.openEdit(r) }
onMounted(() => loadData())
</script>
