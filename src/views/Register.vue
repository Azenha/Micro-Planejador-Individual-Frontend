<!-- frontend/src/views/Register.vue -->

<template>
    <div class="max-w-md mx-auto bg-white p-8 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-4">Create an Account</h2>
      <form @submit.prevent="createUser">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input v-model="registerUsername" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="registerEmail" type="email" class="w-full p-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="registerPassword" type="password" class="w-full p-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Create User</button>
        <div v-if="registerMessage" class="mt-4 text-blue-500 text-center">
        {{ registerMessage }}
      </div>
      </form>
      <div class="mt-4 text-center">
        <router-link to="/" class="text-blue-500">Back to Login</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        registerUsername: '',
        registerEmail: '',
        registerPassword: '',
        registerMessage: ''
      }
    },
    methods: {
      async createUser() {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users`, {
            username: this.registerUsername,
            email: this.registerEmail,
            password: this.registerPassword
          })
          this.registerMessage = 'User created successfully!'
        } catch (error) {
          this.registerMessage = 'User creation failed: ' + error.response.data.message
        }
      }
    }
  }
  </script>
  