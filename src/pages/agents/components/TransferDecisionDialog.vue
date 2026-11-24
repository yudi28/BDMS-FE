<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card v-if="transfer">
      <v-card-title class="text-h6">Review Transfer Request</v-card-title>
      <v-card-text>
        <v-list lines="two" density="compact" class="mb-4 bg-grey-lighten-4 rounded">
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Source Branch</v-list-item-title>
            <v-list-item-subtitle class="text-body-1">{{ transfer.sourceBranchCode }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Destination Branch</v-list-item-title>
            <v-list-item-subtitle class="text-body-1 font-weight-bold text-primary">{{ transfer.destinationBranchCode }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Effective From</v-list-item-title>
            <v-list-item-subtitle class="text-body-1">{{ formatDateTime(transfer.effectiveFrom) }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Reason</v-list-item-title>
            <v-list-item-subtitle class="text-body-1" style="white-space: pre-wrap;">{{ transfer.reason }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Requested By</v-list-item-title>
            <v-list-item-subtitle class="text-body-1">{{ transfer.requestedBy }} at {{ formatDateTime(transfer.requestedAt) }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-form ref="formRef">
          <v-textarea
            v-model="decisionReason"
            label="Decision Reason (Optional)"
            :rules="[maxLength('Reason', 500)]"
            rows="2"
            counter="500"
            auto-grow
          />
        </v-form>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-2"
          closable
          @click:close="clearError()"
        >
          {{ error.message }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="saving">Cancel</v-btn>
        <v-btn color="error" variant="flat" :loading="savingAction === 'reject'" :disabled="!!savingAction" @click="handleDecision('reject')">Reject</v-btn>
        <v-btn color="success" variant="flat" :loading="savingAction === 'approve'" :disabled="!!savingAction" @click="handleDecision('approve')">Approve</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { approveTransfer, rejectTransfer } from '@/services/transfer.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { formatDateTime } from '@/utils/date'
import { maxLength } from '@/utils/validation'
import type { TransferResponse, WorkflowDecisionRequest } from '@/types/transfer'

const emit = defineEmits<{ (e: 'saved'): void }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()

const dialog = ref(false)
const savingAction = ref<'approve' | 'reject' | null>(null)
const transfer = ref<TransferResponse | null>(null)
const agentId = ref('')
const formRef = ref()
const decisionReason = ref('')

const saving = computed(() => !!savingAction.value)

function open(aId: string, item: TransferResponse) {
  agentId.value = aId
  transfer.value = item
  decisionReason.value = ''
  clearError()
  dialog.value = true
}

function close() {
  dialog.value = false
  transfer.value = null
}

async function handleDecision(action: 'approve' | 'reject') {
  if (!transfer.value) return
  const { valid } = await formRef.value.validate()
  if (!valid) return

  savingAction.value = action
  clearError()

  try {
    const request: WorkflowDecisionRequest = {
      reason: decisionReason.value || undefined
    }
    
    if (action === 'approve') {
      await approveTransfer(agentId.value, transfer.value.id, request)
    } else {
      await rejectTransfer(agentId.value, transfer.value.id, request)
    }
    
    appStore.showSuccess(`Transfer ${action}d successfully`)
    emit('saved')
    close()
  } catch (err: any) {
    if (err.response?.status === 409) {
      appStore.showError('Concurrency conflict: The transfer status has changed. Please refresh.')
      emit('saved')
      close()
    } else {
      handleError(err)
    }
  } finally {
    savingAction.value = null
  }
}

defineExpose({ open })
</script>
