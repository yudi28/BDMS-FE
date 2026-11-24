<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ isEdit ? 'Edit Area' : 'Create Area' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-select v-if="!isEdit" v-model="form.regionId" label="Region *" :items="regions" item-title="name" item-value="id"
            :rules="[required('Region')]" :loading="loadingRegions" class="mb-2" />
          <v-text-field v-if="!isEdit" v-model="form.code" label="Code *" :rules="[required('Code'), maxLength('Code', 30)]" counter="30" class="mb-2" />
          <v-text-field v-model="form.name" label="Name *" :rules="[required('Name'), maxLength('Name', 150)]" counter="150" class="mb-2" />
          <v-select v-if="isEdit" v-model="form.status" label="Status" :items="statusOptions" class="mb-2" />
          <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-2" closable @click:close="clearError()">{{ error.message }}</v-alert>
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
import { createArea, updateArea } from '@/services/area.service'
import { getRegions } from '@/services/region.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { required, maxLength } from '@/utils/validation'
import type { AreaResponse } from '@/types/area'
import type { RegionResponse } from '@/types/region'

const emit = defineEmits<{ saved: [] }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()
const dialog = ref(false); const isEdit = ref(false); const saving = ref(false); const editId = ref(''); const formRef = ref()
const regions = ref<RegionResponse[]>([]); const loadingRegions = ref(false)
const statusOptions = ['ACTIVE', 'INACTIVE', 'SUSPENDED']
const form = reactive({ regionId: '', code: '', name: '', status: '' })

function resetForm() { form.regionId = ''; form.code = ''; form.name = ''; form.status = ''; clearError() }
async function loadRegions() { loadingRegions.value = true; try { regions.value = (await getRegions(0, 100)).data.data.content } catch {} finally { loadingRegions.value = false } }
function openCreate() { isEdit.value = false; resetForm(); loadRegions(); dialog.value = true }
function openEdit(a: AreaResponse) { isEdit.value = true; editId.value = a.id; resetForm(); form.name = a.name; form.status = a.status; dialog.value = true }
function close() { dialog.value = false }

async function handleSubmit() {
  const { valid } = await formRef.value.validate(); if (!valid) return
  saving.value = true; clearError()
  try {
    if (isEdit.value) { await updateArea(editId.value, { name: form.name, status: form.status }); appStore.showSuccess('Area updated') }
    else { await createArea({ regionId: form.regionId, code: form.code, name: form.name }); appStore.showSuccess('Area created') }
    emit('saved'); close()
  } catch (err) { handleError(err) } finally { saving.value = false }
}
defineExpose({ openCreate, openEdit })
</script>
