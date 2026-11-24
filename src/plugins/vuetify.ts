import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const bdmsLightTheme = {
  dark: false,
  colors: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    'surface-variant': '#F0F2F5',
    primary: '#1565C0',
    'primary-darken-1': '#0D47A1',
    secondary: '#78909C',
    'secondary-darken-1': '#546E7A',
    accent: '#00ACC1',
    error: '#D32F2F',
    info: '#1976D2',
    success: '#2E7D32',
    warning: '#F57F17',
  },
}

const bdmsDarkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    'surface-variant': '#2C2C2C',
    primary: '#42A5F5',
    'primary-darken-1': '#1E88E5',
    secondary: '#90A4AE',
    'secondary-darken-1': '#78909C',
    accent: '#26C6DA',
    error: '#EF5350',
    info: '#42A5F5',
    success: '#66BB6A',
    warning: '#FFA726',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'bdmsLight',
    themes: {
      bdmsLight: bdmsLightTheme,
      bdmsDark: bdmsDarkTheme,
    },
  },
  defaults: {
    VBtn: {
      variant: 'elevated',
      rounded: 'lg',
    },
    VCard: {
      rounded: 'lg',
      elevation: 2,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VDataTableServer: {
      density: 'comfortable',
    },
  },
})
