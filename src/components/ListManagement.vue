<template>
    <div>
      <h1>List Management</h1>
      <!-- Add list management functionality here -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'ListManagement',
    mounted() {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push('/login')
      }
    }
  }
  </script>
  