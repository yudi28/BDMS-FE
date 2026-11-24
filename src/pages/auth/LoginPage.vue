<template>
  <v-app>
    <v-main class="login-bg d-flex align-center justify-center">
      <v-card class="login-card pa-8" max-width="440" width="100%" elevation="12" rounded="xl">
        <div class="text-center mb-6">
          <v-icon icon="mdi-shield-check" size="56" color="primary" class="mb-3" />
          <h1 class="text-h5 font-weight-bold">BDMS</h1>
          <p class="text-body-2 text-medium-emphasis">Banca Distributed Management System</p>
        </div>

        <v-form ref="formRef" @submit.prevent="handleLogin" :disabled="loading">
          <v-text-field
            v-model="form.username"
            label="Username"
            prepend-inner-icon="mdi-account"
            :rules="[required('Username')]"
            autocomplete="username"
            class="mb-2"
          />

          <v-text-field
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="[required('Password')]"
            autocomplete="current-password"
            class="mb-1"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
            closable
            @click:close="clearError()"
          >
            <div class="text-body-2">{{ error.message }}</div>
            <div v-if="error.errorCode" class="text-caption mt-1">
              Code: {{ error.errorCode }}
            </div>
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
            :disabled="loading"
          >
            Sign In
          </v-btn>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import { useApiError } from '@/composables/useApiError'
import { required } from '@/utils/validation'
import type { LoginRequest } from '@/types/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const { error, clearError, handleError } = useApiError()

const formRef = ref()
const loading = ref(false)
const showPassword = ref(false)

const form = reactive<LoginRequest>({
  username: '',
  password: '',
})

async function handleLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  clearError()

  try {
    await authStore.login(form)
    appStore.showSuccess('Login successful')
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%);
  min-height: 100vh;
}

.login-card {
  backdrop-filter: blur(10px);
}
</style>
