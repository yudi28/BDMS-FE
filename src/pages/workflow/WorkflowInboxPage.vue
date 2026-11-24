<template>
  <div>
    <PageHeader title="Workflow Tasks" subtitle="Manage your pending workflow tasks" />
    <WorkflowTaskTable />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import WorkflowTaskTable from './components/WorkflowTaskTable.vue'
</script>
