<template>
  <v-card>
    <v-card-title class="text-subtitle-1 font-weight-medium">Lifecycle History</v-card-title>
    <v-card-text>
      <v-timeline density="compact" align="start">
        <v-timeline-item
          v-for="item in history"
          :key="item.id"
          :dot-color="getStatusColor(item.toStatus)"
          size="small"
        >
          <div class="mb-1">
            <strong>{{ item.toStatus }}</strong>
            <span class="text-caption text-medium-emphasis ms-2">{{ formatDateTime(item.changedAt) }}</span>
          </div>
          <div class="text-body-2">
            <div>By: {{ item.changedBy }}</div>
            <div v-if="item.reason" class="font-italic text-medium-emphasis">
              "{{ item.reason }}"
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
      <div v-if="!history.length && !loading" class="text-center text-medium-emphasis py-4">
        No lifecycle history available.
      </div>
      <div v-if="loading" class="text-center py-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getLifecycleHistory } from '@/services/agent.service'
import { formatDateTime } from '@/utils/date'
import type { LifecycleHistoryResponse } from '@/types/agent'

const props = defineProps<{
  agentId: string
}>()

const history = ref<LifecycleHistoryResponse[]>([])
const loading = ref(false)

async function loadHistory() {
  if (!props.agentId) return
  loading.value = true
  try {
    const response = await getLifecycleHistory(props.agentId, 0, 100)
    history.value = response.data.data.content
  } catch (e) {
    console.error('Failed to load lifecycle history', e)
  } finally {
    loading.value = false
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE': return 'success'
    case 'REJECTED':
    case 'TERMINATED':
    case 'INACTIVE': return 'error'
    case 'APPROVED': return 'info'
    default: return 'primary'
  }
}

onMounted(() => loadHistory())

// Refresh if agentId changes or needs manual refresh
defineExpose({ refresh: loadHistory })
</script>
