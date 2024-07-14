<!-- frontend/src/views/Login.vue -->

<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded shadow-md">
    <h2 class="text-2xl font-bold mb-4">Entrar</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
        <input v-model="loginEmail" type="email" class="w-full p-2 border rounded" required />
      </div>
        <div class="mb-4">
          <label class="block text-gray-700">Senha</label>
          <input v-model="loginPassword" type="password" class="w-full p-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Entrar</button>
      </form>
      <div class="mt-4 text-center">
      <router-link to="/register" class="text-blue-500">Criar conta</router-link>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        loginEmail: '',
        loginPassword: ''
      }
    },
    methods: {
      async login() {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
            email: this.loginEmail,
            password: this.loginPassword
          })
          localStorage.setItem('token', response.data.token)
          this.$router.push('/lists')
        } catch (error) {
          alert('Login failed: ' + error.response.data.message)
        }
      }
    }
  }
  </script>
