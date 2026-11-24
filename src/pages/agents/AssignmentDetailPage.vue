<template>
  <div>
    <LoadingOverlay :loading="loading" />

    <template v-if="!loading && assignment">
      <PageHeader
        title="Assignment Details"
        :breadcrumbs="[
          { title: 'Agents', to: '/agents' },
          { title: agentId, to: `/agents/${agentId}` },
          { title: 'Assignment', disabled: true },
        ]"
      >
        <template #actions>
          <v-btn variant="outlined" prepend-icon="mdi-arrow-left" :to="`/agents/${agentId}`">Back to Agent</v-btn>
        </template>
      </PageHeader>

      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-list lines="two" density="compact">
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Branch Code</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ assignment.branchCode }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Branch Name</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ assignment.branchName }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title>
                  <v-list-item-subtitle>
                    <StatusChip :status="assignment.status" />
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Assignment Type</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ assignment.assignmentType }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list lines="two" density="compact">
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Effective From</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ formatDateTime(assignment.effectiveFrom) }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Effective To</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ assignment.effectiveTo ? formatDateTime(assignment.effectiveTo) : '—' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Reason</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ assignment.reason || '—' }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis">Created At</v-list-item-title>
                  <v-list-item-subtitle class="text-body-1">{{ formatDateTime(assignment.createdAt) }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">
      {{ errorMessage }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import { getAssignment } from '@/services/assignment.service'
import { formatDateTime } from '@/utils/date'
import type { AssignmentResponse } from '@/types/assignment'

const route = useRoute()
const loading = ref(true)
const assignment = ref<AssignmentResponse | null>(null)
const errorMessage = ref('')

const agentId = ref(route.params.agentId as string)
const assignmentId = ref(route.params.assignmentId as string)

async function loadAssignment() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await getAssignment(agentId.value, assignmentId.value)
    assignment.value = response.data.data
  } catch {
    errorMessage.value = 'Failed to load assignment details'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadAssignment())
</script>
