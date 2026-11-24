<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6">
        {{ isEdit ? 'Edit Agent' : 'Create Agent' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <!-- Create-only fields -->
          <template v-if="!isEdit">
            <v-text-field
              v-model="form.agentCode"
              label="Agent Code *"
              :rules="[required('Agent Code'), maxLength('Agent Code', 30)]"
              counter="30"
              class="mb-2"
            />
            <v-text-field
              v-model="form.nik"
              label="NIK *"
              :rules="[required('NIK')]"
              type="password"
              hint="Sensitive data — will be masked after creation"
              persistent-hint
              class="mb-2"
            />
          </template>

          <v-text-field
            v-model="form.fullName"
            label="Full Name *"
            :rules="[required('Full Name'), maxLength('Full Name', 150)]"
            counter="150"
            class="mb-2"
          />

          <v-text-field
            v-model="form.email"
            label="Email"
            :rules="[email('Email'), maxLength('Email', 150)]"
            counter="150"
            class="mb-2"
          />

          <v-text-field
            v-model="form.phone"
            label="Phone"
            :rules="[maxLength('Phone', 30)]"
            counter="30"
            class="mb-2"
          />

          <!-- Edit-only: status removed as per Phase 2 spec -->
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
            <template v-if="error.errorCode">
              <br /><span class="text-caption">Code: {{ error.errorCode }}</span>
            </template>
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" :loading="saving" @click="handleSubmit">
          {{ isEdit ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { createAgent, updateAgent } from '@/services/agent.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { required, maxLength, email } from '@/utils/validation'
import type { AgentResponse, CreateAgentRequest, UpdateAgentRequest } from '@/types/agent'

const emit = defineEmits<{ saved: [] }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()

const dialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const editId = ref('')
const formRef = ref()


const form = reactive({
  agentCode: '',
  nik: '',
  fullName: '',
  email: '',
  phone: '',
})

function resetForm() {
  form.agentCode = ''
  form.nik = ''
  form.fullName = ''
  form.email = ''
  form.phone = ''
  clearError()
}

function openCreate() {
  isEdit.value = false
  editId.value = ''
  resetForm()
  dialog.value = true
}

function openEdit(agent: AgentResponse) {
  isEdit.value = true
  editId.value = agent.id
  resetForm()
  form.fullName = agent.fullName
  form.email = agent.email || ''
  form.phone = agent.phone || ''
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
    if (isEdit.value) {
      const request: UpdateAgentRequest = {
        fullName: form.fullName,
        email: form.email || undefined,
        phone: form.phone || undefined,
      }
      await updateAgent(editId.value, request)
      appStore.showSuccess('Agent updated successfully')
    } else {
      const request: CreateAgentRequest = {
        agentCode: form.agentCode,
        nik: form.nik,
        fullName: form.fullName,
        email: form.email || undefined,
        phone: form.phone || undefined,
      }
      await createAgent(request)
      appStore.showSuccess('Agent created successfully')
    }
    emit('saved')
    close()
  } catch (err) {
    handleError(err)
  } finally {
    saving.value = false
  }
}

defineExpose({ openCreate, openEdit })
</script>
