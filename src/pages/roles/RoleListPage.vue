<template>
  <div>
    <PageHeader title="Roles" subtitle="System roles (read-only)" />
    <v-card>
      <v-data-table-server :headers="headers" :items="items" :items-length="pagination.totalElements.value"
        :items-per-page="pagination.size.value" :page="pagination.displayPage.value" :loading="loading"
        :items-per-page-options="pagination.itemsPerPageOptions" @update:page="onPageUpdate" @update:items-per-page="onSizeUpdate">
        <template #item.createdAt="{ item }">{{ formatDateTime(item.createdAt) }}</template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/roles/${item.id}`" />
        </template>
        <template #no-data><EmptyState title="No Roles" message="No roles found." icon="mdi-shield-account-outline" /></template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getRoles } from '@/services/role.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { RoleResponse } from '@/types/role'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<RoleResponse[]>([])

const headers = [
  { title: 'Code', key: 'code', sortable: false },
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: false },
  { title: '', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  loading.value = true
  try { const r = await getRoles(pagination.page.value, pagination.size.value); items.value = r.data.data.content; pagination.updateFromResponse(r.data.data) }
  catch { appStore.showError('Failed to load roles') } finally { loading.value = false }
}
function onPageUpdate(p: number) { pagination.onPageChange(p); loadData() }
function onSizeUpdate(s: number) { pagination.onSizeChange(s); loadData() }
onMounted(() => loadData())
</script>
