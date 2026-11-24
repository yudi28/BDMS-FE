import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AppNotification {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
}

let notificationId = 0

export const useAppStore = defineStore('app', () => {
  const sidebarOpen = ref(true)
  const globalLoading = ref(false)
  const notifications = ref<AppNotification[]>([])

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function showNotification(
    message: string,
    type: AppNotification['type'] = 'info',
    timeout = 4000,
  ) {
    const id = ++notificationId
    notifications.value.push({ id, message, type, timeout })
  }

  function removeNotification(id: number) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function showSuccess(message: string) {
    showNotification(message, 'success')
  }

  function showError(message: string) {
    showNotification(message, 'error', 6000)
  }

  return {
    sidebarOpen,
    globalLoading,
    notifications,
    toggleSidebar,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
  }
})
