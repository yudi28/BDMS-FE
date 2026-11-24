<template>
  <div>
    <PageHeader title="Audit Logs" subtitle="System audit trail">
      <template #actions>
        <v-select
          v-model="entityTypeFilter"
          label="Entity Type"
          :items="entityTypes"
          clearable
          density="compact"
          variant="outlined"
          style="max-width: 200px"
          hide-details
          @update:model-value="onFilterChange"
        />
        <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="loadData" :loading="loading">Refresh</v-btn>
      </template>
    </PageHeader>

    <v-card>
      <v-data-table-server :headers="headers" :items="items" :items-length="pagination.totalElements.value"
        :items-per-page="pagination.size.value" :page="pagination.displayPage.value" :loading="loading"
        :items-per-page-options="pagination.itemsPerPageOptions" @update:page="onPageUpdate" @update:items-per-page="onSizeUpdate">
        <template #item.createdAt="{ item }">{{ formatDateTime(item.createdAt) }}</template>
        <template #item.action="{ item }">
          <v-chip :color="getActionColor(item.action)" size="x-small" variant="tonal" label>{{ item.action }}</v-chip>
        </template>
        <template #item.details="{ item }">
          <v-btn v-if="item.oldValue || item.newValue" icon="mdi-eye" variant="text" size="small" @click="showDetail(item)" />
        </template>
        <template #no-data><EmptyState title="No Audit Logs" message="No audit records found." icon="mdi-history" /></template>
      </v-data-table-server>
    </v-card>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="700">
      <v-card v-if="selectedLog">
        <v-card-title class="text-h6">Audit Detail</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="6"><strong>User:</strong> {{ selectedLog.username }}</v-col>
            <v-col cols="6"><strong>Action:</strong> {{ selectedLog.action }}</v-col>
            <v-col cols="6"><strong>Entity Type:</strong> {{ selectedLog.entityType }}</v-col>
            <v-col cols="6"><strong>Entity ID:</strong> {{ selectedLog.entityId }}</v-col>
            <v-col cols="6"><strong>IP Address:</strong> {{ selectedLog.ipAddress }}</v-col>
            <v-col cols="6"><strong>Trace ID:</strong> {{ selectedLog.traceId }}</v-col>
            <v-col cols="12"><strong>Timestamp:</strong> {{ formatDateTime(selectedLog.createdAt) }}</v-col>
          </v-row>

          <template v-if="selectedLog.oldValue">
            <h4 class="mt-4 mb-2">Old Value</h4>
            <pre class="audit-json pa-3 rounded">{{ formatJson(selectedLog.oldValue) }}</pre>
          </template>
          <template v-if="selectedLog.newValue">
            <h4 class="mt-4 mb-2">New Value</h4>
            <pre class="audit-json pa-3 rounded">{{ formatJson(selectedLog.newValue) }}</pre>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer /><v-btn variant="text" @click="detailDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getAuditLogs } from '@/services/audit.service'
import { usePagination } from '@/composables/usePagination'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { AuditLog } from '@/types/audit'

const appStore = useAppStore()
const pagination = usePagination()
const loading = ref(false)
const items = ref<AuditLog[]>([])
const entityTypeFilter = ref<string | undefined>(undefined)
const detailDialog = ref(false)
const selectedLog = ref<AuditLog | null>(null)

const entityTypes = ['AGENT', 'BRANCH', 'BANK', 'REGION', 'AREA', 'USER', 'ROLE']

const headers = [
  { title: 'Timestamp', key: 'createdAt', sortable: false },
  { title: 'User', key: 'username', sortable: false },
  { title: 'Action', key: 'action', sortable: false },
  { title: 'Entity Type', key: 'entityType', sortable: false },
  { title: 'Entity ID', key: 'entityId', sortable: false, maxWidth: '120' },
  { title: 'IP', key: 'ipAddress', sortable: false },
  { title: 'Trace ID', key: 'traceId', sortable: false, maxWidth: '120' },
  { title: '', key: 'details', sortable: false, align: 'center' as const },
]

function getActionColor(action: string): string {
  if (action.includes('CREATE')) return 'success'
  if (action.includes('UPDATE')) return 'info'
  if (action.includes('DELETE')) return 'error'
  return 'secondary'
}

function formatJson(value: string | null): string {
  if (!value) return '—'
  try {
    const parsed = JSON.parse(value)
    // Mask NIK if present
    if (parsed.nik) parsed.nik = '********'
    if (parsed.nikMasked) parsed.nikMasked = parsed.nikMasked
    return JSON.stringify(parsed, null, 2)
  } catch {
    return value
  }
}

function showDetail(log: AuditLog) {
  selectedLog.value = log
  detailDialog.value = true
}

async function loadData() {
  loading.value = true
  try {
    const r = await getAuditLogs(pagination.page.value, pagination.size.value, entityTypeFilter.value || undefined)
    items.value = r.data.data.content
    pagination.updateFromResponse(r.data.data)
  } catch { appStore.showError('Failed to load audit logs') }
  finally { loading.value = false }
}

function onFilterChange() { pagination.resetPage(); loadData() }
function onPageUpdate(p: number) { pagination.onPageChange(p); loadData() }
function onSizeUpdate(s: number) { pagination.onSizeChange(s); loadData() }
onMounted(() => loadData())
</script>

<style scoped>
.audit-json {
  background: rgba(0, 0, 0, 0.05);
  font-family: monospace;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
