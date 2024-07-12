<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await api.post('/api/v1/auth/login', {
          email: this.email,
          password: this.password
        })
        console.log('Logged in successfully:', response.data)
        // Handle successful login (e.g., store token, redirect, etc.)
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Login Error:', error.response.status, error.response.data)
          this.error = error.response.data.message || 'Login failed'
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request Error:', error.request)
          this.error = 'No response from server'
        } else {
          // Something happened in setting up the request that triggered an error
          console.error('Error Message:', error.message)
          this.error = 'An unexpected error occurred'
        }
      }
    }
  }
}
</script>
