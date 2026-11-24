<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card v-if="task">
      <v-card-title class="text-h6">
        {{ decisionType === 'approve' ? 'Approve Task' : 'Reject Task' }}
      </v-card-title>
      <v-card-text>
        <p class="mb-4">
          Are you sure you want to <strong>{{ decisionType }}</strong> this task for 
          {{ task.entityType }} (ID: {{ task.entityId }})?
        </p>

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
        <v-btn
          :color="decisionType === 'approve' ? 'success' : 'error'"
          variant="flat"
          :loading="saving"
          @click="handleDecision"
        >
          {{ decisionType === 'approve' ? 'Approve' : 'Reject' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { approveTask, rejectTask } from '@/services/workflow.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { maxLength } from '@/utils/validation'
import type { WorkflowTaskResponse, WorkflowDecisionRequest } from '@/types/workflow'

const emit = defineEmits<{ (e: 'saved'): void }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()

const dialog = ref(false)
const saving = ref(false)
const task = ref<WorkflowTaskResponse | null>(null)
const decisionType = ref<'approve' | 'reject'>('approve')
const formRef = ref()
const decisionReason = ref('')

function open(t: WorkflowTaskResponse, type: 'approve' | 'reject') {
  task.value = t
  decisionType.value = type
  decisionReason.value = ''
  clearError()
  dialog.value = true
}

function close() {
  dialog.value = false
  task.value = null
}

async function handleDecision() {
  if (!task.value) return
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  clearError()

  try {
    const request: WorkflowDecisionRequest = {
      reason: decisionReason.value || undefined
    }
    
    if (decisionType.value === 'approve') {
      await approveTask(task.value.id, request)
    } else {
      await rejectTask(task.value.id, request)
    }
    
    appStore.showSuccess(`Task ${decisionType.value}d successfully`)
    emit('saved')
    close()
  } catch (err: any) {
    if (err.response?.status === 409) {
      appStore.showError('Conflict: Task state changed or self-approval is not allowed. Please refresh.')
      emit('saved')
      close()
    } else {
      handleError(err)
    }
  } finally {
    saving.value = false
  }
}

defineExpose({ open })
</script>
