<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ isEdit ? 'Edit Bank' : 'Create Bank' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field v-if="!isEdit" v-model="form.code" label="Code *" :rules="[required('Code'), maxLength('Code', 30)]" counter="30" class="mb-2" />
          <v-text-field v-model="form.name" label="Name *" :rules="[required('Name'), maxLength('Name', 150)]" counter="150" class="mb-2" />
          <v-select v-if="isEdit" v-model="form.status" label="Status" :items="statusOptions" class="mb-2" />
          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-2" closable @click:close="clearError()">
            {{ error.message }}<template v-if="error.errorCode"><br /><span class="text-caption">Code: {{ error.errorCode }}</span></template>
          </v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer /><v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" :loading="saving" @click="handleSubmit">{{ isEdit ? 'Update' : 'Create' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { createBank, updateBank } from '@/services/bank.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { required, maxLength } from '@/utils/validation'
import type { BankResponse } from '@/types/bank'

const emit = defineEmits<{ saved: [] }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()
const dialog = ref(false); const isEdit = ref(false); const saving = ref(false); const editId = ref(''); const formRef = ref()
const statusOptions = ['ACTIVE', 'INACTIVE', 'SUSPENDED']
const form = reactive({ code: '', name: '', status: '' })

function resetForm() { form.code = ''; form.name = ''; form.status = ''; clearError() }
function openCreate() { isEdit.value = false; resetForm(); dialog.value = true }
function openEdit(b: BankResponse) { isEdit.value = true; editId.value = b.id; resetForm(); form.name = b.name; form.status = b.status; dialog.value = true }
function close() { dialog.value = false }

async function handleSubmit() {
  const { valid } = await formRef.value.validate(); if (!valid) return
  saving.value = true; clearError()
  try {
    if (isEdit.value) { await updateBank(editId.value, { name: form.name, status: form.status }); appStore.showSuccess('Bank updated') }
    else { await createBank({ code: form.code, name: form.name }); appStore.showSuccess('Bank created') }
    emit('saved'); close()
  } catch (err) { handleError(err) } finally { saving.value = false }
}
defineExpose({ openCreate, openEdit })
</script>
