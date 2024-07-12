<!-- frontend/src/views/Login.vue -->

<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div>
          <label for="loginEmail">Email:</label>
          <input type="email" id="loginEmail" v-model="loginEmail" required>
        </div>
        <div>
          <label for="loginPassword">Password:</label>
          <input type="password" id="loginPassword" v-model="loginPassword" required>
        </div>
        <button type="submit">Login</button>
      </form>
      
      <h1>Create User</h1>
      <form @submit.prevent="createUser">
        <div>
          <label for="registerUsername">Username:</label>
          <input type="text" id="registerUsername" v-model="registerUsername" required>
        </div>
        <div>
          <label for="registerEmail">Email:</label>
          <input type="email" id="registerEmail" v-model="registerEmail" required>
        </div>
        <div>
          <label for="registerPassword">Password:</label>
          <input type="password" id="registerPassword" v-model="registerPassword" required>
        </div>
        <button type="submit">Create User</button>
        <div v-if="registerMessage">{{ registerMessage }}</div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        loginEmail: '',
        loginPassword: '',
        registerUsername: '',
        registerEmail: '',
        registerPassword: '',
        registerMessage: ''
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
      },
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
  