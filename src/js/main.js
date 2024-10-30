import { createApp } from 'vue'
import Autocomplete from '@trevoreyre/autocomplete-vue'

import App from './App.vue'

import '../scss/styles.scss'
import '@trevoreyre/autocomplete-vue/dist/style.css'

const app = createApp(App)
app.use(Autocomplete)
app.mount('#app')
