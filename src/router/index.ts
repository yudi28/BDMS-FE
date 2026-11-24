import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false, title: 'Login' },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },
  // Agents
  {
    path: '/agents',
    name: 'agents',
    component: () => import('@/pages/agents/AgentListPage.vue'),
    meta: { requiresAuth: true, title: 'Agents' },
  },
  {
    path: '/agents/:id',
    name: 'agent-detail',
    component: () => import('@/pages/agents/AgentDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Agent Detail' },
  },
  {
    path: '/agents/:agentId/assignments/:assignmentId',
    name: 'assignment-detail',
    component: () => import('@/pages/agents/AssignmentDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Assignment Detail' },
  },
  // Workflow
  {
    path: '/workflow/tasks',
    name: 'workflow-tasks',
    component: () => import('@/pages/workflow/WorkflowInboxPage.vue'),
    meta: { requiresAuth: true, title: 'Workflow Tasks' },
  },
  {
    path: '/workflow/tasks/:taskId',
    name: 'workflow-task-detail',
    component: () => import('@/pages/workflow/WorkflowTaskDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Task Detail' },
  },
  // Branches
  {
    path: '/branches',
    name: 'branches',
    component: () => import('@/pages/branches/BranchListPage.vue'),
    meta: { requiresAuth: true, title: 'Branches' },
  },
  {
    path: '/branches/:id',
    name: 'branch-detail',
    component: () => import('@/pages/branches/BranchDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Branch Detail' },
  },
  // Banks
  {
    path: '/banks',
    name: 'banks',
    component: () => import('@/pages/banks/BankListPage.vue'),
    meta: { requiresAuth: true, title: 'Banks' },
  },
  {
    path: '/banks/:id',
    name: 'bank-detail',
    component: () => import('@/pages/banks/BankDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Bank Detail' },
  },
  // Regions
  {
    path: '/regions',
    name: 'regions',
    component: () => import('@/pages/regions/RegionListPage.vue'),
    meta: { requiresAuth: true, title: 'Regions' },
  },
  {
    path: '/regions/:id',
    name: 'region-detail',
    component: () => import('@/pages/regions/RegionDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Region Detail' },
  },
  // Areas
  {
    path: '/areas',
    name: 'areas',
    component: () => import('@/pages/areas/AreaListPage.vue'),
    meta: { requiresAuth: true, title: 'Areas' },
  },
  {
    path: '/areas/:id',
    name: 'area-detail',
    component: () => import('@/pages/areas/AreaDetailPage.vue'),
    meta: { requiresAuth: true, title: 'Area Detail' },
  },
  // Users
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/users/UserListPage.vue'),
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'], title: 'Users' },
  },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: () => import('@/pages/users/UserDetailPage.vue'),
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'], title: 'User Detail' },
  },
  // Roles
  {
    path: '/roles',
    name: 'roles',
    component: () => import('@/pages/roles/RoleListPage.vue'),
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'], title: 'Roles' },
  },
  {
    path: '/roles/:id',
    name: 'role-detail',
    component: () => import('@/pages/roles/RoleDetailPage.vue'),
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'], title: 'Role Detail' },
  },
  // Audit Logs
  {
    path: '/audit-logs',
    name: 'audit-logs',
    component: () => import('@/pages/audit-logs/AuditLogListPage.vue'),
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN', 'ROLE_AUDITOR'], title: 'Audit Logs' },
  },
  // Catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // Set page title
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} — BDMS` : 'BDMS'

  // Public routes
  if (to.meta.requiresAuth === false) {
    if (authStore.authenticated && to.name === 'login') {
      next('/dashboard')
    } else {
      next()
    }
    return
  }

  // Protected routes — check authentication
  if (!authStore.authenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // RBAC — check route roles
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authStore.hasAnyRole(requiredRoles)) {
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
