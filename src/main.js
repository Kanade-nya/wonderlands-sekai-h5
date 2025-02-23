import { createApp } from 'vue'
import './style.scss'
// import '@waline/client/style';
import App from './App.vue'
// import {routes} from "vue-router/auto-routes";
import router from './router/router'

import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
