<template>
  <div>
    <LoadingOverlay :loading="loading" />

    <template v-if="!loading && task">
      <PageHeader
        title="Task Detail"
        :breadcrumbs="[
          { title: 'Workflow Tasks', to: '/workflow/tasks' },
          { title: task.id, disabled: true },
        ]"
      >
        <template #actions>
          <v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/workflow/tasks">Back</v-btn>
        </template>
      </PageHeader>

      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title class="text-subtitle-1 font-weight-medium">Task Information</v-card-title>
            <v-card-text>
              <v-list lines="two" density="compact">
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Task ID</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ task.id }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Workflow Type</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ task.workflowType }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Task Type</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ task.taskType }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title>
                  <v-list-item-subtitle>
                    <StatusChip :status="task.status" />
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Entity Type & ID</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">
                    {{ task.entityType }} —
                    <router-link
                      v-if="entityRoute"
                      :to="entityRoute"
                      class="text-decoration-none text-primary"
                    >
                      {{ task.entityId }}
                    </router-link>
                    <span v-else>{{ task.entityId }}</span>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Assigned Role</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ task.assignedRole }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Assigned User ID</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ task.assignedUserId || 'Unclaimed' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="task.decisionReason">
                  <v-list-item-title class="text-caption text-medium-emphasis">Decision Reason</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1" style="white-space: pre-wrap;">{{ task.decisionReason }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Timestamps</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">
                    <div>Created: {{ formatDateTime(task.createdAt) }}</div>
                    <div v-if="task.claimedAt">Claimed: {{ formatDateTime(task.claimedAt) }}</div>
                    <div v-if="task.completedAt">Completed: {{ formatDateTime(task.completedAt) }}</div>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-medium">Actions</v-card-title>
            <v-card-text class="d-flex flex-column gap-2">
              <v-btn
                v-if="canClaim"
                color="primary"
                variant="flat"
                block
                :loading="loadingAction === 'claim'"
                :disabled="!!loadingAction"
                @click="handleClaim"
              >
                Claim Task
              </v-btn>
              
              <v-btn
                v-if="canDecide"
                color="success"
                variant="flat"
                block
                :loading="loadingAction === 'approve'"
                :disabled="!!loadingAction"
                @click="openDecision('approve')"
                class="mt-2"
              >
                Approve
              </v-btn>

              <v-btn
                v-if="canDecide"
                color="error"
                variant="flat"
                block
                :loading="loadingAction === 'reject'"
                :disabled="!!loadingAction"
                @click="openDecision('reject')"
                class="mt-2"
              >
                Reject
              </v-btn>

              <div v-if="!canClaim && !canDecide" class="text-caption text-medium-emphasis text-center py-2">
                No actions available for this task.
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">
      {{ errorMessage }}
    </v-alert>

    <WorkflowDecisionDialog ref="decisionDialogRef" @saved="loadTask" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import WorkflowDecisionDialog from './components/WorkflowDecisionDialog.vue'
import { getTask, claimTask } from '@/services/workflow.service'
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import { formatDateTime } from '@/utils/date'
import type { WorkflowTaskResponse } from '@/types/workflow'

const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()

const loading = ref(true)
const loadingAction = ref<string | null>(null)
const task = ref<WorkflowTaskResponse | null>(null)
const errorMessage = ref('')
const decisionDialogRef = ref<InstanceType<typeof WorkflowDecisionDialog>>()

const taskId = ref(route.params.taskId as string)

const entityRoute = computed(() => {
  if (!task.value) return null
  if (task.value.entityType === 'AGENT') return `/agents/${task.value.entityId}`
  // Add other entity types if necessary
  return null
})

const canClaim = computed(() => {
  if (!task.value) return false
  return task.value.status === 'PENDING' && authStore.hasAnyRole([task.value.assignedRole, 'ROLE_ADMIN'])
})

const canDecide = computed(() => {
  if (!task.value) return false
  // For some workflows it can be CLAIMED, for some it might jump to APPROVED directly if not claimed?
  // Let's assume you must claim it first (or ADMIN can bypass, but typical pattern is CLAIMED status).
  // The spec says: "CLAIMED". We will allow decision if CLAIMED.
  return task.value.status === 'CLAIMED' && authStore.hasAnyRole([task.value.assignedRole, 'ROLE_ADMIN'])
})

async function loadTask() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await getTask(taskId.value)
    task.value = response.data.data
  } catch {
    errorMessage.value = 'Failed to load task details'
  } finally {
    loading.value = false
  }
}

async function handleClaim() {
  if (!task.value) return
  loadingAction.value = 'claim'
  try {
    await claimTask(task.value.id)
    appStore.showSuccess('Task claimed successfully')
    await loadTask()
  } catch (err: any) {
    if (err.response?.status === 409) {
      appStore.showError('Conflict: Task is already claimed or state changed. Please refresh.')
      await loadTask()
    } else {
      appStore.showError(err.response?.data?.message || 'Failed to claim task')
    }
  } finally {
    loadingAction.value = null
  }
}

function openDecision(type: 'approve' | 'reject') {
  if (task.value) {
    decisionDialogRef.value?.open(task.value, type)
  }
}

onMounted(() => loadTask())
</script>
