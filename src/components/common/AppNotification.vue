<template>
  <div>
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      :model-value="true"
      :color="notification.type"
      :timeout="notification.timeout"
      location="top right"
      @update:model-value="removeNotification(notification.id)"
    >
      {{ notification.message }}
      <template #actions>
        <v-btn variant="text" icon="mdi-close" @click="removeNotification(notification.id)" />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()
const { notifications } = storeToRefs(appStore)
const { removeNotification } = appStore
</script>
