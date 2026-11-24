<template>
  <div>
    <v-card class="mb-4">
      <v-card-title class="text-subtitle-1 font-weight-medium">Lifecycle Actions</v-card-title>
      <v-card-text class="d-flex flex-wrap gap-2">
        <v-btn
          v-if="canSubmit"
          color="primary"
          variant="flat"
          @click="openAction('submit')"
          :loading="loadingAction === 'submit'"
        >
          Submit
        </v-btn>

        <v-btn
          v-if="canVerify"
          color="info"
          variant="flat"
          @click="openAction('verify')"
          :loading="loadingAction === 'verify'"
        >
          Verify
        </v-btn>

        <v-btn
          v-if="canApprove"
          color="success"
          variant="flat"
          @click="openAction('approve')"
          :loading="loadingAction === 'approve'"
        >
          Approve
        </v-btn>

        <v-btn
          v-if="canReject"
          color="error"
          variant="flat"
          @click="openAction('reject')"
          :loading="loadingAction === 'reject'"
        >
          Reject
        </v-btn>

        <v-btn
          v-if="canActivate"
          color="success"
          variant="flat"
          @click="openAction('activate')"
          :loading="loadingAction === 'activate'"
        >
          Activate
        </v-btn>

        <v-btn
          v-if="canDeactivate"
          color="error"
          variant="flat"
          @click="openAction('deactivate')"
          :loading="loadingAction === 'deactivate'"
        >
          Deactivate
        </v-btn>

        <span v-if="!hasAnyAction" class="text-caption text-medium-emphasis">
          No actions available for the current status.
        </span>
      </v-card-text>
    </v-card>

    <ActionReasonDialog
      ref="reasonDialog"
      :required="isReasonRequired"
      :loading="!!loadingAction"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import ActionReasonDialog from './ActionReasonDialog.vue'
import {
  submitAgent,
  verifyAgent,
  approveAgent,
  rejectAgent,
  activateAgent,
  deactivateAgent
} from '@/services/agent.service'
import type { AgentResponse, LifecycleActionRequest, RejectRequest } from '@/types/agent'

const props = defineProps<{
  agent: AgentResponse
  hasActiveAssignment?: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const authStore = useAuthStore()
const appStore = useAppStore()

const reasonDialog = ref<InstanceType<typeof ActionReasonDialog>>()
const loadingAction = ref<string | null>(null)
const currentAction = ref<string | null>(null)

// Action Permissions
const canSubmit = computed(() => props.agent.status === 'DRAFT' && authStore.hasAnyRole(['ROLE_BRANCH_USER', 'ROLE_ADMIN']))
const canVerify = computed(() => props.agent.status === 'SUBMITTED' && authStore.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN']))
const canApprove = computed(() => props.agent.status === 'VERIFICATION' && authStore.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN']))
const canReject = computed(() => ['SUBMITTED', 'VERIFICATION'].includes(props.agent.status) && authStore.hasAnyRole(['ROLE_MANAGER', 'ROLE_ADMIN']))
const canActivate = computed(() => props.agent.status === 'APPROVED' && authStore.hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER']) && props.hasActiveAssignment)
const canDeactivate = computed(() => props.agent.status === 'ACTIVE' && authStore.hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER']))

const hasAnyAction = computed(() => canSubmit.value || canVerify.value || canApprove.value || canReject.value || canActivate.value || canDeactivate.value)

const isReasonRequired = computed(() => ['reject', 'deactivate'].includes(currentAction.value || ''))

function openAction(action: string) {
  currentAction.value = action
  let title = ''
  let message = ''
  let color = 'primary'

  switch (action) {
    case 'submit':
      title = 'Submit Agent'
      message = 'Are you sure you want to submit this agent for verification?'
      break
    case 'verify':
      title = 'Verify Agent'
      message = 'Are you sure you want to verify this agent?'
      color = 'info'
      break
    case 'approve':
      title = 'Approve Agent'
      message = 'Are you sure you want to approve this agent?'
      color = 'success'
      break
    case 'reject':
      title = 'Reject Agent'
      message = 'Are you sure you want to reject this agent? A reason is required.'
      color = 'error'
      break
    case 'activate':
      title = 'Activate Agent'
      message = 'Are you sure you want to activate this agent?'
      color = 'success'
      break
    case 'deactivate':
      title = 'Deactivate Agent'
      message = 'Are you sure you want to deactivate this agent? A reason is required.'
      color = 'error'
      break
  }

  reasonDialog.value?.open({ title, message, color })
}

async function handleConfirm(reason: string) {
  if (!currentAction.value) return

  loadingAction.value = currentAction.value
  const id = props.agent.id

  try {
    const actionReq: LifecycleActionRequest = { reason: reason || undefined }
    const rejectReq: RejectRequest = { reason }

    switch (currentAction.value) {
      case 'submit':
        await submitAgent(id, actionReq)
        break
      case 'verify':
        await verifyAgent(id, actionReq)
        break
      case 'approve':
        await approveAgent(id, actionReq)
        break
      case 'reject':
        await rejectAgent(id, rejectReq)
        break
      case 'activate':
        await activateAgent(id, actionReq)
        break
      case 'deactivate':
        await deactivateAgent(id, rejectReq)
        break
    }

    appStore.showSuccess(`Agent ${currentAction.value}d successfully`)
    reasonDialog.value?.close()
    emit('refresh')
  } catch (err: any) {
    if (err.response?.status === 409) {
      appStore.showError('Concurrency conflict: The agent status has changed since it was loaded. Please refresh.')
      emit('refresh')
    } else {
      appStore.showError(err.response?.data?.message || `Failed to ${currentAction.value} agent`)
    }
  } finally {
    loadingAction.value = null
    currentAction.value = null
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
