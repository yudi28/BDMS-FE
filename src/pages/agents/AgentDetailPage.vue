<template>
  <div>
    <LoadingOverlay :loading="loading" />

    <template v-if="!loading && agent">
      <PageHeader
        :title="agent.fullName"
        :subtitle="`Agent Code: ${agent.agentCode}`"
        :breadcrumbs="[
          { title: 'Agents', to: '/agents' },
          { title: agent.fullName, disabled: true },
        ]"
      >
        <template #actions>
          <v-btn variant="outlined" prepend-icon="mdi-arrow-left" to="/agents">Back</v-btn>
        </template>
      </PageHeader>

      <v-tabs v-model="activeTab" bg-color="transparent" class="mb-4">
        <v-tab value="overview">Overview</v-tab>
        <v-tab value="assignments">Assignments</v-tab>
        <v-tab value="transfers">Transfers</v-tab>
        <v-tab value="lifecycle">Lifecycle History</v-tab>
      </v-tabs>

      <v-window v-model="activeTab" :touch="false">
        <v-window-item value="overview">
          <v-row>
            <v-col cols="12" md="8">
              <v-card class="mb-4">
                <v-card-title class="text-subtitle-1 font-weight-medium">Profile</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-list lines="two" density="compact">
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">Agent Code</v-list-item-title>
                          <v-list-item-subtitle class="text-body-1">{{ agent.agentCode }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">NIK (Masked)</v-list-item-title>
                          <v-list-item-subtitle class="text-body-1 text-mono">{{ agent.nikMasked }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">Full Name</v-list-item-title>
                          <v-list-item-subtitle class="text-body-1">{{ agent.fullName }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">Email</v-list-item-title>
                          <v-list-item-subtitle class="text-body-1">{{ agent.email || '—' }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-list lines="two" density="compact">
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">Phone</v-list-item-title>
                          <v-list-item-subtitle class="text-body-1">{{ agent.phone || '—' }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">Status</v-list-item-title>
                          <v-list-item-subtitle>
                            <StatusChip :status="agent.status" />
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">Created</v-list-item-title>
                          <v-list-item-subtitle class="text-body-1">{{ formatDateTime(agent.createdAt) }}</v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title class="text-caption text-medium-emphasis">Last Updated</v-list-item-title>
                          <v-list-item-subtitle class="text-body-1">{{ formatDateTime(agent.updatedAt) }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <AgentLifecycleActions
                :agent="agent"
                :has-active-assignment="hasActiveAssignment"
                @refresh="handleRefresh"
              />
              <AgentAssignmentCard
                :agent-status="agent.status"
                :active-assignment="activeAssignment"
                :loading="loadingAssignments"
                @assign="openAssignDialog"
                class="mt-4"
              />
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="assignments">
          <AssignmentHistoryTable
            ref="assignmentsTableRef"
            :agent-id="agent.id"
            @update:active-assignment="handleActiveAssignmentUpdate"
          />
        </v-window-item>

        <v-window-item value="transfers">
          <TransferHistoryTable
            ref="transfersTableRef"
            :agent-id="agent.id"
            :agent-status="agent.status"
            @request-transfer="openTransferRequestDialog"
            @decide="openTransferDecisionDialog"
          />
        </v-window-item>

        <v-window-item value="lifecycle">
          <AgentLifecycleTimeline ref="timelineRef" :agent-id="agent.id" />
        </v-window-item>
      </v-window>
    </template>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">
      {{ errorMessage }}
    </v-alert>

    <AssignmentFormDialog ref="assignDialogRef" @saved="handleRefresh" />
    <TransferRequestDialog ref="transferReqDialogRef" @saved="handleRefresh" />
    <TransferDecisionDialog ref="transferDecDialogRef" @saved="handleRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import AgentLifecycleActions from './components/AgentLifecycleActions.vue'
import AgentLifecycleTimeline from './components/AgentLifecycleTimeline.vue'
import AgentAssignmentCard from './components/AgentAssignmentCard.vue'
import AssignmentHistoryTable from './components/AssignmentHistoryTable.vue'
import AssignmentFormDialog from './components/AssignmentFormDialog.vue'
import TransferHistoryTable from './components/TransferHistoryTable.vue'
import TransferRequestDialog from './components/TransferRequestDialog.vue'
import TransferDecisionDialog from './components/TransferDecisionDialog.vue'
import { getAgent } from '@/services/agent.service'
import { formatDateTime } from '@/utils/date'
import type { AgentResponse } from '@/types/agent'
import type { AssignmentResponse } from '@/types/assignment'
import type { TransferResponse } from '@/types/transfer'

const route = useRoute()
const loading = ref(true)
const loadingAssignments = ref(false)
const agent = ref<AgentResponse | null>(null)
const errorMessage = ref('')

const activeTab = ref('overview')
const hasActiveAssignment = ref(false)
const activeAssignment = ref<AssignmentResponse | null>(null)

const timelineRef = ref<InstanceType<typeof AgentLifecycleTimeline>>()
const assignmentsTableRef = ref<InstanceType<typeof AssignmentHistoryTable>>()
const assignDialogRef = ref<InstanceType<typeof AssignmentFormDialog>>()
const transfersTableRef = ref<InstanceType<typeof TransferHistoryTable>>()
const transferReqDialogRef = ref<InstanceType<typeof TransferRequestDialog>>()
const transferDecDialogRef = ref<InstanceType<typeof TransferDecisionDialog>>()

async function loadAgent() {
  loading.value = true
  errorMessage.value = ''
  try {
    const id = route.params.id as string
    const response = await getAgent(id)
    agent.value = response.data.data
  } catch {
    errorMessage.value = 'Failed to load agent details'
  } finally {
    loading.value = false
  }
}

function handleRefresh() {
  loadAgent()
  if (timelineRef.value) timelineRef.value.refresh()
  if (assignmentsTableRef.value) assignmentsTableRef.value.refresh()
  if (transfersTableRef.value) transfersTableRef.value.refresh()
}

function handleActiveAssignmentUpdate(assignment: AssignmentResponse | null) {
  activeAssignment.value = assignment
  hasActiveAssignment.value = !!assignment
}

function openAssignDialog() {
  if (agent.value) {
    assignDialogRef.value?.open(agent.value.id)
  }
}

function openTransferRequestDialog() {
  if (agent.value) {
    transferReqDialogRef.value?.open(agent.value.id)
  }
}

function openTransferDecisionDialog(transfer: TransferResponse) {
  if (agent.value) {
    transferDecDialogRef.value?.open(agent.value.id, transfer)
  }
}

onMounted(() => loadAgent())
</script>
