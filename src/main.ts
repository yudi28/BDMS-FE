import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import pinia from './plugins/pinia'
import router from './router'
import { useAuthStore } from './stores/auth.store'

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(router)

// Initialize auth state from sessionStorage before mounting
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
