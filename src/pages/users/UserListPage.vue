<template>
  <div>
    <PageHeader title="Users" subtitle="Manage system users">
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">New User</v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="loadData" :loading="loading">Refresh</v-btn>
      </template>
    </PageHeader>
    <v-card>
      <v-data-table-server :headers="headers" :items="items" :items-length="pagination.totalElements.value"
        :items-per-page="pagination.size.value" :page="pagination.displayPage.value" :loading="loading"
        :items-per-page-options="pagination.itemsPerPageOptions" @update:page="onPageUpdate" @update:items-per-page="onSizeUpdate">
        <template #item.status="{ item }"><StatusChip :status="item.status" size="small" /></template>
        <template #item.roles="{ item }">
          <v-chip v-for="role in item.roles" :key="role" size="x-small" variant="outlined" color="primary" class="mr-1">{{ role }}</v-chip>
        </template>
        <template #item.createdAt="{ item }">{{ formatDateTime(item.createdAt) }}</template>
        <template #item.updatedAt="{ item }">{{ formatDateTime(item.updatedAt) }}</template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" variant="text" size="small" :to="`/users/${item.id}`" />
          <v-btn icon="mdi-pencil" variant="text" size="small" @click="openEditDialog(item)" />
        </template>
        <template #no-data><EmptyState title="No Users" message="No users found." icon="mdi-account-cog-outline" /></template>
      </v-data-table-server>
    </v-card>
    <UserFormDialog ref="formDialog" @saved="loadData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import UserFormDialog from './UserFormDialog.vue'
import { getUsers } from '@/services/user.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { UserResponse } from '@/types/user'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<UserResponse[]>([])
const formDialog = ref<InstanceType<typeof UserFormDialog>>()

const headers = [
  { title: 'Username', key: 'username', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Roles', key: 'roles', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: false },
  { title: 'Updated', key: 'updatedAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

async function loadData() {
  loading.value = true
  try { const r = await getUsers(pagination.page.value, pagination.size.value); items.value = r.data.data.content; pagination.updateFromResponse(r.data.data) }
  catch { appStore.showError('Failed to load users') } finally { loading.value = false }
}
function onPageUpdate(p: number) { pagination.onPageChange(p); loadData() }
function onSizeUpdate(s: number) { pagination.onSizeChange(s); loadData() }
function openCreateDialog() { formDialog.value?.openCreate() }
function openEditDialog(u: UserResponse) { formDialog.value?.openEdit(u) }
onMounted(() => loadData())
</script>
