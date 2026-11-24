<template>
  <v-app>
    <v-navigation-drawer
      v-model="sidebarOpen"
      :rail="rail"
      permanent
      color="primary-darken-1"
      class="sidebar"
    >
      <v-list-item
        class="px-4 py-3"
        :prepend-icon="rail ? undefined : undefined"
      >
        <template #prepend>
          <v-icon icon="mdi-shield-check" color="white" size="28" />
        </template>
        <v-list-item-title class="text-h6 font-weight-bold text-white">
          BDMS
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption text-white" style="opacity: 0.7">
          Bancassurance DMS
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider class="mb-1" color="white" style="opacity: 0.15" />

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in visibleNavItems"
          :key="item.route"
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.label"
          rounded="lg"
          class="nav-item mb-1"
          color="white"
          active-class="nav-item-active"
        />
      </v-list>

      <template #append>
        <v-divider color="white" style="opacity: 0.15" />
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-chevron-left"
            :title="rail ? '' : 'Collapse'"
            rounded="lg"
            class="nav-item"
            @click="rail = !rail"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat density="compact" color="surface" elevation="1">
      <v-app-bar-nav-icon @click="appStore.toggleSidebar()" class="d-lg-none" />

      <v-spacer />

      <v-btn icon size="small" @click="toggleTheme" class="mr-2">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="text-none" rounded="pill">
            <v-avatar size="32" color="primary" class="mr-2">
              <span class="text-caption font-weight-bold text-white">
                {{ userInitials }}
              </span>
            </v-avatar>
            <span class="d-none d-sm-inline">{{ authStore.username }}</span>
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" min-width="200">
          <v-list-item disabled>
            <v-list-item-title class="text-body-2 font-weight-medium">
              {{ authStore.username }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ authStore.userRoles.join(', ') }}
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider />
          <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>

    <AppNotification />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import AppNotification from '@/components/common/AppNotification.vue'

const router = useRouter()
const theme = useTheme()
const authStore = useAuthStore()
const appStore = useAppStore()
const { sidebarOpen } = appStore

const rail = ref(false)
const isDark = computed(() => theme.global.current.value.dark)

const navItems = [
  { label: 'Dashboard', route: '/dashboard', icon: 'mdi-view-dashboard', roles: [] as string[] },
  { label: 'Agents', route: '/agents', icon: 'mdi-account-group', roles: [] as string[] },
  { label: 'Branches', route: '/branches', icon: 'mdi-office-building', roles: [] as string[] },
  { label: 'Banks', route: '/banks', icon: 'mdi-bank', roles: [] as string[] },
  { label: 'Regions', route: '/regions', icon: 'mdi-map', roles: [] as string[] },
  { label: 'Areas', route: '/areas', icon: 'mdi-map-marker-multiple', roles: [] as string[] },
  { label: 'Users', route: '/users', icon: 'mdi-account-cog', roles: ['ROLE_ADMIN'] },
  { label: 'Roles', route: '/roles', icon: 'mdi-shield-account', roles: ['ROLE_ADMIN'] },
  { label: 'Audit Logs', route: '/audit-logs', icon: 'mdi-history', roles: ['ROLE_ADMIN', 'ROLE_AUDITOR'] },
]

const visibleNavItems = computed(() =>
  navItems.filter((item) => {
    if (item.roles.length === 0) return true
    return authStore.hasAnyRole(item.roles)
  }),
)

const userInitials = computed(() => {
  const name = authStore.username
  if (!name) return '?'
  return name.substring(0, 2).toUpperCase()
})

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'bdmsLight' : 'bdmsDark'
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  border-right: none !important;
}

.nav-item {
  margin-inline: 8px;
}

.nav-item-active {
  background: rgba(255, 255, 255, 0.15) !important;
}
</style>
