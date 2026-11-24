<template>
  <div>
    <PageHeader title="Dashboard" subtitle="System overview" />

    <v-row>
      <v-col v-for="widget in widgets" :key="widget.title" cols="12" sm="6" lg="4" xl="3">
        <v-card class="widget-card" :loading="widget.loading">
          <v-card-text class="d-flex align-center pa-5">
            <v-avatar :color="widget.color" size="56" rounded="lg" class="mr-4">
              <v-icon :icon="widget.icon" size="28" color="white" />
            </v-avatar>
            <div>
              <div class="text-h4 font-weight-bold">
                <template v-if="widget.loading">—</template>
                <template v-else>{{ widget.value.toLocaleString() }}</template>
              </div>
              <div class="text-body-2 text-medium-emphasis">{{ widget.title }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      v-if="hasError"
      type="warning"
      variant="tonal"
      class="mt-6"
    >
      Some dashboard data could not be loaded. The displayed counts may be incomplete.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { getAgents } from '@/services/agent.service'
import { getBranches } from '@/services/branch.service'
import { getBanks } from '@/services/bank.service'
import { getUsers } from '@/services/user.service'

interface DashboardWidget {
  title: string
  value: number
  icon: string
  color: string
  loading: boolean
}

const hasError = ref(false)

const widgets = reactive<DashboardWidget[]>([
  { title: 'Total Agents', value: 0, icon: 'mdi-account-group', color: 'primary', loading: true },
  { title: 'Total Branches', value: 0, icon: 'mdi-office-building', color: 'accent', loading: true },
  { title: 'Total Banks', value: 0, icon: 'mdi-bank', color: 'success', loading: true },
  { title: 'Total Users', value: 0, icon: 'mdi-account-cog', color: 'warning', loading: true },
])

async function loadCount(
  index: number,
  fetcher: (page: number, size: number) => Promise<{ data: { data: { totalElements: number } } }>,
) {
  try {
    const response = await fetcher(0, 1)
    widgets[index].value = response.data.data.totalElements
  } catch {
    hasError.value = true
  } finally {
    widgets[index].loading = false
  }
}

onMounted(() => {
  // Load counts using page=0&size=1 to get totalElements efficiently
  loadCount(0, getAgents)
  loadCount(1, getBranches)
  loadCount(2, getBanks)
  loadCount(3, getUsers)
})
</script>

<style scoped>
.widget-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.widget-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}
</style>
