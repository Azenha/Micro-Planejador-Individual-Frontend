<!-- frontend/src/App.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-blue-500 text-white p-4">
      <h1 class="text-center text-2xl">Shopping List Manager</h1>
    </header>
    <main class="flex-grow p-4">
      <router-view />
    </main>
    <footer class="bg-blue-500 text-white p-4 text-center">
      <p>&copy; 2024 Shopping List Manager. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
