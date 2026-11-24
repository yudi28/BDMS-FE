<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>
        <p class="mb-4">{{ message }}</p>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-textarea
            v-model="reason"
            :label="required ? 'Reason *' : 'Reason (Optional)'"
            :rules="rules"
            rows="3"
            counter="500"
            auto-grow
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close" :disabled="loading">Cancel</v-btn>
        <v-btn
          :color="confirmColor"
          :loading="loading"
          @click="handleSubmit"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  loading?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm', reason: string): void
}>()

const dialog = ref(false)
const title = ref('')
const message = ref('')
const reason = ref('')
const confirmColor = ref('primary')
const formRef = ref()

const rules = computed(() => {
  const arr: ((v: string) => boolean | string)[] = [
    (v: string) => (!v || v.length <= 500) || 'Must be less than 500 characters'
  ]
  if (props.required) {
    arr.unshift(
      (v: string) => !!v || 'Reason is required',
      (v: string) => (v && v.length >= 3) || 'Must be at least 3 characters'
    )
  }
  return arr
})

function open(opts: { title: string; message: string; color?: string }) {
  title.value = opts.title
  message.value = opts.message
  confirmColor.value = opts.color || 'primary'
  reason.value = ''
  dialog.value = true
}

function close() {
  dialog.value = false
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  emit('confirm', reason.value)
}

defineExpose({ open, close })
</script>
