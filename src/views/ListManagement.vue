<!-- frontend/src/views/ListManagement.vue -->
<template>
  <div>
    <h2 class="text-center text-2xl font-bold mb-4">Gerir listas</h2>
    <form @submit.prevent="createList" class="max-w-md mx-auto bg-white p-8 rounded shadow-md mb-4">
      <div class="mb-4">
        <label class="block text-gray-700">Nova lista</label>
        <input v-model="listName" type="text" class="w-full p-2 border rounded" required />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Criar lista</button>
    </form>
    <h3 class="text-center text-xl font-bold mb-2">Suas listas</h3>
    <table class="w-1/2 mx-auto bg-white border rounded">
      <thead>
        <tr>
          <th class="border px-4 py-2">Lista</th>
          <th class="border px-4 py-2">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="list in lists" :key="list.id">
          <td class="text-center border px-4 py-2">{{ list.name }}</td>
          <td class="text-center border px-4 py-2">
            <button @click="goToItems(list.id)" class="bg-green-500 text-white px-4 py-2 rounded mr-2"><ShoppingCartIcon class="h-5 w-5 inline-block" /></button>
            <button @click="editList(list)" class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"><PencilSquareIcon class="h-5 w-5 inline-block" /></button>
            <button @click="confirmDelete(list.id)" class="bg-red-500 text-white px-4 py-2 rounded"><TrashIcon class="h-5 w-5 inline-block" /></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Logout Button -->
    <div class="flex justify-center mt-4">
      <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded"><ArrowUturnLeftIcon class="h-5 w-5 inline-block mr-2" /> Logout</button>
    </div>

    <!-- Edit List Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow-md">
        <h3 class="text-xl font-bold mb-4">Editar nome da lista</h3>
        <form @submit.prevent="updateList">
          <div class="mb-4">
            <label class="block text-gray-700">Novo nome</label>
            <input v-model="editListName" type="text" class="w-full p-2 border rounded" required />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Atualizar</button>
          <button @click="showEditModal = false" class="w-full bg-gray-500 text-white p-2 rounded mt-2">Cancelar</button>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow-md">
          <h3 class="text-xl font-bold mb-4">Você deseja excluir esta lista?</h3>
        <button @click="deleteList" class="w-full bg-red-500 text-white p-2 rounded">Excluir</button>
        <button @click="showDeleteModal = false" class="w-full bg-gray-500 text-white p-2 rounded mt-2">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ShoppingCartIcon, PencilSquareIcon, TrashIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline'
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
  components: {
    ShoppingCartIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowUturnLeftIcon
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
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/').catch(err => {
        console.error(err)
        alert('Failed to navigate to login page')
      })
    },
  },
  mounted() {
    this.fetchLists()
  }
}
</script>
