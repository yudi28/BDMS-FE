<template>
  <v-card class="mb-4">
    <v-card-title class="text-subtitle-1 font-weight-medium">
      Current Assignment
    </v-card-title>
    <v-card-text>
      <div v-if="loading" class="text-center py-2">
        <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
      </div>
      <template v-else-if="activeAssignment">
        <div class="mb-2">
          <div class="text-caption text-medium-emphasis">Branch</div>
          <div class="text-body-1 font-weight-medium">
            {{ activeAssignment.branchCode }} - {{ activeAssignment.branchName }}
          </div>
        </div>
        <div class="mb-2">
          <div class="text-caption text-medium-emphasis">Effective From</div>
          <div class="text-body-2">{{ formatDateTime(activeAssignment.effectiveFrom) }}</div>
        </div>
        <div>
          <v-chip size="small" color="success">ACTIVE</v-chip>
        </div>
      </template>
      <template v-else>
        <div class="text-body-2 text-medium-emphasis mb-2">No active assignment.</div>
        <v-btn
          v-if="canAssign"
          color="primary"
          variant="tonal"
          size="small"
          @click="$emit('assign')"
        >
          Assign to Branch
        </v-btn>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { formatDateTime } from '@/utils/date'
import type { AssignmentResponse } from '@/types/assignment'

const props = defineProps<{
  agentStatus: string
  activeAssignment: AssignmentResponse | null
  loading: boolean
}>()

defineEmits<{
  (e: 'assign'): void
}>()

const authStore = useAuthStore()

const canAssign = computed(() => {
  return ['DRAFT', 'SUBMITTED', 'VERIFICATION', 'APPROVED'].includes(props.agentStatus) && 
         authStore.hasAnyRole(['ROLE_BRANCH_USER', 'ROLE_ADMIN'])
})
</script>
