<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ isEdit ? 'Edit User' : 'Create User' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field v-if="!isEdit" v-model="form.username" label="Username *"
            :rules="[required('Username'), minLength('Username', 3), maxLength('Username', 100)]" counter="100" class="mb-2" />
          <v-text-field v-model="form.email" label="Email *" :rules="[required('Email'), email('Email'), maxLength('Email', 150)]"
            counter="150" class="mb-2" />
          <v-text-field v-model="form.password" :label="isEdit ? 'Password (leave blank to keep)' : 'Password *'"
            type="password" :rules="isEdit ? optionalPasswordRules : requiredPasswordRules"
            autocomplete="new-password" class="mb-2" />
          <v-select v-model="form.roleIds" label="Roles" :items="roles" item-title="name" item-value="id"
            multiple chips :loading="loadingRoles" class="mb-2" />
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
import { createUser, updateUser } from '@/services/user.service'
import { getRoles } from '@/services/role.service'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { required, maxLength, minLength, email, passwordRules } from '@/utils/validation'
import type { UserResponse } from '@/types/user'
import type { RoleResponse } from '@/types/role'

const emit = defineEmits<{ saved: [] }>()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()
const dialog = ref(false); const isEdit = ref(false); const saving = ref(false); const editId = ref(''); const formRef = ref()
const roles = ref<RoleResponse[]>([]); const loadingRoles = ref(false)
const statusOptions = ['ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED']
const requiredPasswordRules = passwordRules(true)
const optionalPasswordRules = passwordRules(false)

const form = reactive({ username: '', email: '', password: '', roleIds: [] as string[], status: '' })

function resetForm() { form.username = ''; form.email = ''; form.password = ''; form.roleIds = []; form.status = ''; clearError() }

async function loadRoles() {
  loadingRoles.value = true
  try { roles.value = (await getRoles(0, 100)).data.data.content } catch {} finally { loadingRoles.value = false }
}

function openCreate() { isEdit.value = false; resetForm(); loadRoles(); dialog.value = true }
function openEdit(u: UserResponse) {
  isEdit.value = true; editId.value = u.id; resetForm()
  form.email = u.email; form.status = u.status
  // Note: we cannot pre-select roleIds because UserResponse only has role code strings, not UUIDs.
  // The user must re-select roles when editing.
  loadRoles(); dialog.value = true
}
function close() { dialog.value = false }

async function handleSubmit() {
  const { valid } = await formRef.value.validate(); if (!valid) return
  saving.value = true; clearError()
  try {
    if (isEdit.value) {
      const req: Record<string, unknown> = { email: form.email, status: form.status }
      if (form.password) req.password = form.password
      if (form.roleIds.length > 0) req.roleIds = form.roleIds
      await updateUser(editId.value, req as any)
      appStore.showSuccess('User updated')
    } else {
      await createUser({ username: form.username, email: form.email, password: form.password, roleIds: form.roleIds.length > 0 ? form.roleIds : undefined })
      appStore.showSuccess('User created')
    }
    emit('saved'); close()
  } catch (err) { handleError(err) } finally { saving.value = false }
}
defineExpose({ openCreate, openEdit })
</script>
