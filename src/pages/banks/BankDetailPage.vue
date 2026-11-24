<template>
  <div>
    <LoadingOverlay :loading="loading" />
    <template v-if="!loading && bank">
      <PageHeader :title="bank.name" :subtitle="`Code: ${bank.code}`"
        :breadcrumbs="[{ title: 'Banks', to: '/banks' }, { title: bank.name, disabled: true }]">
        <template #actions><v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/banks">Back</v-btn></template>
      </PageHeader>
      <v-card><v-card-text>
        <v-list lines="two" density="compact">
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Code</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ bank.code }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Name</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ bank.name }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title><v-list-item-subtitle><StatusChip :status="bank.status" /></v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(bank.createdAt) }}</v-list-item-subtitle></v-list-item>
          <v-list-item><v-list-item-title class="text-caption text-medium-emphasis">Updated</v-list-item-title><v-list-item-subtitle class="text-body-1">{{ formatDateTime(bank.updatedAt) }}</v-list-item-subtitle></v-list-item>
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
import { getBank } from '@/services/bank.service'
import { formatDateTime } from '@/utils/date'
import type { BankResponse } from '@/types/bank'

const route = useRoute()
const loading = ref(true)
const bank = ref<BankResponse | null>(null)
const errorMessage = ref('')

onMounted(async () => {
  try { bank.value = (await getBank(route.params.id as string)).data.data }
  catch { errorMessage.value = 'Failed to load bank details' }
  finally { loading.value = false }
})
</script>
