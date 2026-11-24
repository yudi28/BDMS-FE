<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ isEdit ? 'Edit Branch' : 'Create Branch' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <template v-if="!isEdit">
            <v-select v-model="form.bankId" label="Bank *" :items="banks" item-title="name" item-value="id"
              :rules="[required('Bank')]" :loading="loadingBanks" class="mb-2" />
            <v-select v-model="form.areaId" label="Area *" :items="areas" item-title="name" item-value="id"
              :rules="[required('Area')]" :loading="loadingAreas" class="mb-2" />
            <v-text-field v-model="form.code" label="Branch Code *" :rules="[required('Code'), maxLength('Code', 30)]"
              counter="30" class="mb-2" />
          </template>
          <v-text-field v-model="form.name" label="Name *" :rules="[required('Name'), maxLength('Name', 150)]"
            counter="150" class="mb-2" />
          <v-textarea v-model="form.address" label="Address" rows="2" class="mb-2" />
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
import { ref, reactive, onMounted } from 'vue'
import { createBranch, updateBranch } from '@/services/branch.service'
import { getBanks } from '@/services/bank.service'
import { getAreas } from '@/services/area.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { required, maxLength } from '@/utils/validation'
import type { BranchResponse } from '@/types/branch'
import type { BankResponse } from '@/types/bank'
import type { AreaResponse } from '@/types/area'

const emit = defineEmits<{ saved: [] }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()

const dialog = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const editId = ref('')
const formRef = ref()
const banks = ref<BankResponse[]>([])
const areas = ref<AreaResponse[]>([])
const loadingBanks = ref(false)
const loadingAreas = ref(false)

const statusOptions = ['DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSED']
const form = reactive({ bankId: '', areaId: '', code: '', name: '', address: '', status: '' })

function resetForm() { form.bankId = ''; form.areaId = ''; form.code = ''; form.name = ''; form.address = ''; form.status = ''; clearError() }

async function loadDropdowns() {
  loadingBanks.value = true; loadingAreas.value = true
  try { const r = await getBanks(0, 100); banks.value = r.data.data.content } catch { /* silent */ } finally { loadingBanks.value = false }
  try { const r = await getAreas(0, 100); areas.value = r.data.data.content } catch { /* silent */ } finally { loadingAreas.value = false }
}

function openCreate() { isEdit.value = false; resetForm(); loadDropdowns(); dialog.value = true }
function openEdit(b: BranchResponse) { isEdit.value = true; editId.value = b.id; resetForm(); form.name = b.name; form.address = b.address || ''; form.status = b.status; dialog.value = true }
function close() { dialog.value = false }

async function handleSubmit() {
  const { valid } = await formRef.value.validate(); if (!valid) return
  saving.value = true; clearError()
  try {
    if (isEdit.value) {
      await updateBranch(editId.value, { name: form.name, status: form.status, address: form.address || undefined })
      appStore.showSuccess('Branch updated successfully')
    } else {
      await createBranch({ bankId: form.bankId, areaId: form.areaId, code: form.code, name: form.name, address: form.address || undefined })
      appStore.showSuccess('Branch created successfully')
    }
    emit('saved'); close()
  } catch (err) { handleError(err) } finally { saving.value = false }
}

defineExpose({ openCreate, openEdit })
</script>
