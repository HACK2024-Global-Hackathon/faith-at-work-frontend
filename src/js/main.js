import { createApp } from 'vue'
import Autocomplete from '@trevoreyre/autocomplete-vue'

import App from './App.vue'
import { worker } from '../mocks/browser'

import '../scss/styles.scss'
import '@trevoreyre/autocomplete-vue/dist/style.css'

worker.start()

const app = createApp(App)
app.use(Autocomplete)
app.mount('#app')
