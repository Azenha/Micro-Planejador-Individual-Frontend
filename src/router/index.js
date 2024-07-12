import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import ListManagement from '../components/ListManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/lists',
    name: 'ListManagement',
    component: ListManagement
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
