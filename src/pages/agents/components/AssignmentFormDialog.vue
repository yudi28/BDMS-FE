<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6">Assign Agent to Branch</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-autocomplete
            v-model="form.branchId"
            :items="branches"
            item-title="name"
            item-value="id"
            label="Select Branch *"
            :rules="[required('Branch')]"
            :loading="loadingBranches"
            class="mb-2"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props" :title="item.raw.name" :subtitle="item.raw.code"></v-list-item>
            </template>
          </v-autocomplete>

          <v-text-field
            v-model="form.effectiveFrom"
            label="Effective From *"
            type="datetime-local"
            :rules="[required('Effective From Date')]"
            class="mb-2"
          />

          <v-textarea
            v-model="form.reason"
            label="Reason (Optional)"
            :rules="[maxLength('Reason', 500)]"
            rows="3"
            counter="500"
            auto-grow
            class="mb-2"
          />

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-2"
            closable
            @click:close="clearError()"
          >
            {{ error.message }}
          </v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close" :disabled="saving">Cancel</v-btn>
        <v-btn color="primary" :loading="saving" @click="handleSubmit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getBranches } from '@/services/branch.service'
import { createAssignment } from '@/services/assignment.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { required, maxLength } from '@/utils/validation'
import dayjs from 'dayjs'
import type { BranchResponse } from '@/types/branch'
import type { AssignmentCreateRequest } from '@/types/assignment'

const emit = defineEmits<{ (e: 'saved'): void }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()

const dialog = ref(false)
const saving = ref(false)
const loadingBranches = ref(false)
const agentId = ref('')
const formRef = ref()

const branches = ref<BranchResponse[]>([])

const form = reactive({
  branchId: '',
  effectiveFrom: '',
  reason: ''
})

async function fetchBranches() {
  loadingBranches.value = true
  try {
    const response = await getBranches(0, 100)
    branches.value = response.data.data.content
  } catch (err) {
    appStore.showError('Failed to load branches')
  } finally {
    loadingBranches.value = false
  }
}

function resetForm() {
  form.branchId = ''
  form.effectiveFrom = dayjs().format('YYYY-MM-DDTHH:mm')
  form.reason = ''
  clearError()
}

function open(id: string) {
  agentId.value = id
  resetForm()
  if (!branches.value.length) {
    fetchBranches()
  }
  dialog.value = true
}

function close() {
  dialog.value = false
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  clearError()

  try {
    const request: AssignmentCreateRequest = {
      branchId: form.branchId,
      effectiveFrom: new Date(form.effectiveFrom).toISOString(),
      reason: form.reason || undefined
    }
    await createAssignment(agentId.value, request)
    appStore.showSuccess('Branch assigned successfully')
    emit('saved')
    close()
  } catch (err) {
    handleError(err)
  } finally {
    saving.value = false
  }
}

defineExpose({ open })
</script>
