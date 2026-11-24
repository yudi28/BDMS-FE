<template>
  <div>
    <LoadingOverlay :loading="loading" />
    <template v-if="!loading && role">
      <PageHeader :title="role.name" :subtitle="`Code: ${role.code}`"
        :breadcrumbs="[{ title: 'Roles', to: '/roles' }, { title: role.name, disabled: true }]">
        <template #actions><v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/roles">Back</v-btn></template>
      </PageHeader>
      <v-card><v-card-text>
        <v-list lines="two" density="compact">
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Code</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ role.code }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Name</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ role.name }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Description</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ role.description || '—' }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(role.createdAt) }}</v-list-item-subtitle></v-list-item>
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
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { getRole } from '@/services/role.service'
import { formatDateTime } from '@/utils/date'
import type { RoleResponse } from '@/types/role'

const route = useRoute()
const loading = ref(true)
const role = ref<RoleResponse | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  try { role.value = (await getRole(route.params.id as string)).data.data }
  catch { errorMessage.value = 'Failed to load role details' } finally { loading.value = false }
})
</script>
