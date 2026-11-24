<template>
  <div>
    <LoadingOverlay :loading="loading" />
    <template v-if="!loading && user">
      <PageHeader :title="user.username" subtitle="User Detail"
        :breadcrumbs="[{ title: 'Users', to: '/users' }, { title: user.username, disabled: true }]">
        <template #actions><v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/users">Back</v-btn></template>
      </PageHeader>
      <v-card><v-card-text>
        <v-list lines="two" density="compact">
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Username</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ user.username }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Email</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ user.email }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title><v-list-item-subtitle><StatusChip :status="user.status" /></v-list-item-subtitle></v-list-item>
          <v-list-item>
            <v-list-item-title class="text-caption text-medium-emphasis">Roles</v-list-item-title>
            <v-list-item-subtitle>
              <v-chip v-for="role in user.roles" :key="role" size="small" variant="outlined" color="primary" class="mr-1">{{ role }}</v-chip>
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(user.createdAt) }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Updated</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(user.updatedAt) }}</v-list-item-subtitle></v-list-item>
        </v-list>
      </v-card-text></v-card>
    </template>
    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">{{ errorMessage }}</v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { getUser } from '@/services/user.service'
import { formatDateTime } from '@/utils/date'
import type { UserResponse } from '@/types/user'

const route = useRoute()
const loading = ref(true)
const user = ref<UserResponse | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  try { user.value = (await getUser(route.params.id as string)).data.data }
  catch { errorMessage.value = 'Failed to load user details' } finally { loading.value = false }
})
</script>
