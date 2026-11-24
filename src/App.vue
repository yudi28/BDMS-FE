<template>
  <template v-if="isLoginRoute">
    <router-view />
  </template>
  <template v-else>
    <DefaultLayout />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()

const isLoginRoute = computed(() => route.name === 'login')
</script>
