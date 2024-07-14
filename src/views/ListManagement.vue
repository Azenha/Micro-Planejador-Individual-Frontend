<!-- frontend/src/views/ListManagement.vue -->
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">List Management</h2>
    <form @submit.prevent="createList" class="mb-4">
      <div class="mb-4">
        <label class="block text-gray-700">List Name</label>
        <input v-model="listName" type="text" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Create List</button>
    </form>
    <h3 class="text-xl font-bold mb-2">Your Lists</h3>
    <table class="min-w-full bg-white border rounded">
      <thead>
        <tr>
          <th class="border px-4 py-2">List Name</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="list in lists" :key="list.id">
          <td class="border px-4 py-2">{{ list.name }}</td>
          <td class="border px-4 py-2">
            <button @click="goToItems(list.id)" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Manage Items</button>
            <button @click="editList(list)" class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit Name</button>
            <button @click="confirmDelete(list.id)" class="bg-red-500 text-white px-4 py-2 rounded">Delete List</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit List Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow-md">
        <h3 class="text-xl font-bold mb-4">Edit List Name</h3>
        <form @submit.prevent="updateList">
          <div class="mb-4">
            <label class="block text-gray-700">New List Name</label>
            <input v-model="editListName" type="text" class="w-full p-2 border rounded" required />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Update List</button>
          <button @click="showEditModal = false" class="w-full bg-gray-500 text-white p-2 rounded mt-2">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow-md">
        <h3 class="text-xl font-bold mb-4">Are you sure you want to delete this list?</h3>
        <button @click="deleteList" class="w-full bg-red-500 text-white p-2 rounded">Delete</button>
        <button @click="showDeleteModal = false" class="w-full bg-gray-500 text-white p-2 rounded mt-2">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      lists: [],
      listName: '',
      showEditModal: false,
      editListId: null,
      editListName: '',
      showDeleteModal: false,
      deleteListId: null
    }
  },
  methods: {
    async fetchLists() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.lists = response.data
      } catch (error) {
        alert('Failed to fetch lists')
      }
    },
    async createList() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/lists`, {
          name: this.listName
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.lists.push(response.data)
        this.listName = ''
      } catch (error) {
        alert('Failed to create list')
      }
    },
    goToItems(listId) {
      this.$router.push(`/lists/${listId}`)
    },
    editList(list) {
      this.editListId = list.id
      this.editListName = list.name
      this.showEditModal = true
    },
    async updateList() {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.editListId}`, {
          name: this.editListName
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const index = this.lists.findIndex(list => list.id === this.editListId)
        this.lists.splice(index, 1, response.data)
        this.showEditModal = false
      } catch (error) {
        alert('Failed to update list')
      }
    },
    confirmDelete(listId) {
      this.deleteListId = listId
      this.showDeleteModal = true
    },
    async deleteList() {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.deleteListId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const index = this.lists.findIndex(list => list.id === this.deleteListId)
        this.lists.splice(index, 1)
        this.showDeleteModal = false
      } catch (error) {
        alert('Failed to delete list')
      }
    }
  },
  mounted() {
    this.fetchLists()
  }
}
</script>
