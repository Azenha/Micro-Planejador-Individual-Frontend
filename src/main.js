// frontend/src/main.js

import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'
import './index.css' // Add this line to import Tailwind CSS

createApp(App)
  .use(router)
  .mount('#app')