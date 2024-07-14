<!-- frontend/src/views/ItemManagement.vue -->
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Item Management for {{ listName }}</h2>
    <form @submit.prevent="createItem" class="mb-4">
      <div class="mb-4">
        <label class="block text-gray-700">Item Name</label>
        <input v-model="itemName" type="text" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Quantity</label>
        <input v-model="quantity" type="number" class="w-full p-2 border rounded" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Unit</label>
        <input v-model="unit" type="text" class="w-full p-2 border rounded" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Value</label>
        <input v-model="value" type="number" step="0.01" class="w-full p-2 border rounded" />
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Add Item</button>
    </form>
    <h3 class="text-xl font-bold mb-2">Items in {{ listName }}</h3>
    <table class="min-w-full bg-white border rounded">
      <thead>
        <tr>
          <th class="border px-4 py-2">Purchased</th>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Quantity</th>
          <th class="border px-4 py-2">Unit</th>
          <th class="border px-4 py-2">Value</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td class="border px-4 py-2">
            <input type="checkbox" v-model="item.completed" @change="toggleCompleted(item)" />
          </td>
          <td class="border px-4 py-2">{{ item.description }}</td>
          <td class="border px-4 py-2">{{ item.quantity }}</td>
          <td class="border px-4 py-2">{{ item.unit }}</td>
          <td class="border px-4 py-2">{{ item.value }}</td>
          <td class="border px-4 py-2">
            <button @click="editItem(item)" class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit</button>
            <button @click="confirmDelete(item.id)" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Item Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow-md">
        <h3 class="text-xl font-bold mb-4">Edit Item</h3>
        <form @submit.prevent="updateItem">
          <div class="mb-4">
            <label class="block text-gray-700">Item Name</label>
            <input v-model="editItemName" type="text" class="w-full p-2 border rounded" required />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Quantity</label>
            <input v-model="editQuantity" type="number" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Unit</label>
            <input v-model="editUnit" type="text" class="w-full p-2 border rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Value</label>
            <input v-model="editValue" type="number" step="0.01" class="w-full p-2 border rounded" />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">Update Item</button>
          <button @click="showEditModal = false" class="w-full bg-gray-500 text-white p-2 rounded mt-2">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow-md">
        <h3 class="text-xl font-bold mb-4">Are you sure you want to delete this item?</h3>
        <button @click="deleteItem" class="w-full bg-red-500 text-white p-2 rounded">Delete</button>
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
      listName: '',
      items: [],
      itemName: '',
      quantity: null,
      unit: '',
      value: null,
      showEditModal: false,
      editItemId: null,
      editItemName: '',
      editQuantity: null,
      editUnit: '',
      editValue: null,
      showDeleteModal: false,
      deleteItemId: null
    }
  },
  methods: {
    async fetchItems() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.items = response.data
      } catch (error) {
        alert('Failed to fetch items')
      }
    },
    async createItem() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items`, {
          description: this.itemName,
          quantity: this.quantity,
          unit: this.unit,
          value: this.value
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.items.push(response.data)
        this.itemName = ''
        this.quantity = null
        this.unit = ''
        this.value = null
      } catch (error) {
        alert('Failed to create item')
      }
    },
    async toggleCompleted(item) {
      try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items/${item.id}`, {
          completed: item.completed
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      } catch (error) {
        alert('Failed to update item status')
      }
    },
    editItem(item) {
      this.editItemId = item.id
      this.editItemName = item.description
      this.editQuantity = item.quantity
      this.editUnit = item.unit
      this.editValue = item.value
      this.showEditModal = true
    },
    async updateItem() {
      try {
        const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items/${this.editItemId}`, {
          description: this.editItemName,
          quantity: this.editQuantity,
          unit: this.editUnit,
          value: this.editValue
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const index = this.items.findIndex(item => item.id === this.editItemId)
        this.items.splice(index, 1, response.data)
        this.showEditModal = false
      } catch (error) {
        alert('Failed to update item')
      }
    },
    confirmDelete(itemId) {
      this.deleteItemId = itemId
      this.showDeleteModal = true
    },
    async deleteItem() {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items/${this.deleteItemId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const index = this.items.findIndex(item => item.id === this.deleteItemId)
        this.items.splice(index, 1)
        this.showDeleteModal = false
      } catch (error) {
        alert('Failed to delete item')
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      this.listName = response.data.name
    } catch (error) {
      alert('Failed to fetch list details')
    }
    this.fetchItems()
  }
}
</script>
