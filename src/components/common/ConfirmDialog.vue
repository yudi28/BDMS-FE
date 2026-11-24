<template>
  <v-dialog v-model="dialog" max-width="450" persistent>
    <v-card>
      <v-card-title class="text-h6">
        <v-icon :color="color" class="mr-2">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn :color="color" variant="elevated" :loading="loading" @click="confirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    confirmText?: string
    color?: string
    icon?: string
  }>(),
  {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    color: 'primary',
    icon: 'mdi-help-circle-outline',
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialog = ref(false)
const loading = ref(false)

function open() {
  dialog.value = true
}

function close() {
  dialog.value = false
  loading.value = false
}

function confirm() {
  emit('confirm')
  close()
}

function cancel() {
  emit('cancel')
  close()
}

defineExpose({ open, close })
</script>
