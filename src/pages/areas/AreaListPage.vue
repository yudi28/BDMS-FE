<template>
  <div>
    <PageHeader title="Areas" subtitle="Manage area divisions">
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">New Area</v-btn>
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
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/areas/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEditDialog(item)" />
        </template>
        <template #no-data><EmptyState title="No Areas" message="No areas found." icon="mdi-map-marker-outline" /></template>
      </v-data-table-server>
    </v-card>
    <AreaFormDialog ref="formDialog" @saved="loadData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AreaFormDialog from './AreaFormDialog.vue'
import { getAreas } from '@/services/area.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { AreaResponse } from '@/types/area'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<AreaResponse[]>([])
const formDialog = ref<InstanceType<typeof AreaFormDialog>>()

const headers = [
  { title: 'Code', key: 'code', sortable: false },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Region', key: 'regionName', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  loading.value = true
  try { const r = await getAreas(pagination.page.value, pagination.size.value); items.value = r.data.data.content; pagination.updateFromResponse(r.data.data) }
  catch { appStore.showError('Failed to load areas') } finally { loading.value = false }
}
function onPageUpdate(p: number) { pagination.onPageChange(p); loadData() }
function onSizeUpdate(s: number) { pagination.onSizeChange(s); loadData() }
function openCreateDialog() { formDialog.value?.openCreate() }
function openEditDialog(a: AreaResponse) { formDialog.value?.openEdit(a) }
onMounted(() => loadData())
</script>
