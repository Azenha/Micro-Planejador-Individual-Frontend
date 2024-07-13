<!-- frontend/src/views/ItemManagement.vue -->

<template>
    <div>
      <h1>Items in {{ list.name }}</h1>
  
      <!-- Form to create a new item -->
      <form @submit.prevent="createItem">
        <div>
          <label for="itemName">Item Name:</label>
          <input type="text" id="itemName" v-model="newItemName" required>
        </div>
        <div>
          <label for="itemQuantity">Quantity:</label>
          <input type="number" id="itemQuantity" v-model="newItemQuantity">
        </div>
        <div>
          <label for="itemUnit">Unit:</label>
          <input type="text" id="itemUnit" v-model="newItemUnit">
        </div>
        <div>
          <label for="itemValue">Value:</label>
          <input type="number" step="0.01" id="itemValue" v-model="newItemValue">
        </div>
        <button type="submit">Create Item</button>
      </form>
  
      <!-- Table to display items -->
      <table>
        <thead>
          <tr>
            <th>Purchased</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td><input type="checkbox" v-model="item.completed" @change="togglePurchased(item)"></td>
            <td>{{ item.description }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.unit }}</td>
            <td>{{ item.value }}</td>
            <td>
              <button @click="editItem(item.id)">Edit</button>
              <button @click="confirmDeleteItem(item.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal for edit confirmation -->
      <div v-if="editModalOpen" class="modal">
        <div class="modal-content">
          <h2>Edit Item</h2>
          <form @submit.prevent="updateItem">
            <div>
              <label for="editItemName">Item Name:</label>
              <input type="text" id="editItemName" v-model="editItemName" required>
            </div>
            <div>
              <label for="editItemQuantity">Quantity:</label>
              <input type="number" id="editItemQuantity" v-model="editItemQuantity">
            </div>
            <div>
              <label for="editItemUnit">Unit:</label>
              <input type="text" id="editItemUnit" v-model="editItemUnit">
            </div>
            <div>
              <label for="editItemValue">Value:</label>
              <input type="number" step="0.01" id="editItemValue" v-model="editItemValue">
            </div>
            <button type="submit">Save</button>
            <button @click="closeEditModal">Cancel</button>
          </form>
        </div>
      </div>
  
      <!-- Modal for delete confirmation -->
      <div v-if="deleteModalOpen" class="modal">
        <div class="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this item?</p>
          <button @click="deleteItem">Yes, delete it</button>
          <button @click="closeDeleteModal">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        list: {},
        newItemName: '',
        newItemQuantity: '',
        newItemUnit: '',
        newItemValue: '',
        items: [],
        editModalOpen: false,
        deleteModalOpen: false,
        editItemId: null,
        editItemName: '',
        editItemQuantity: '',
        editItemUnit: '',
        editItemValue: '',
        deleteItemId: null
      }
    },
    methods: {
      async createItem() {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items`, {
            description: this.newItemName,
            quantity: this.newItemQuantity,
            unit: this.newItemUnit,
            value: this.newItemValue
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.items.push(response.data)
          this.newItemName = ''
          this.newItemQuantity = ''
          this.newItemUnit = ''
          this.newItemValue = ''
        } catch (error) {
          alert('Failed to create item: ' + error.response.data.message)
        }
      },
      async fetchList() {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.list = response.data
        } catch (error) {
          alert('Failed to fetch list: ' + error.response.data.message)
        }
      },
      async fetchItems() {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.items = response.data
        } catch (error) {
          alert('Failed to fetch items: ' + error.response.data.message)
        }
      },
      async togglePurchased(item) {
        try {
          await axios.put(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items/${item.id}`, {
            completed: item.completed
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        } catch (error) {
          alert('Failed to update item: ' + error.response.data.message)
        }
      },
      editItem(itemId) {
        const item = this.items.find(item => item.id === itemId)
        this.editItemId = itemId
        this.editItemName = item.description
        this.editItemQuantity = item.quantity
        this.editItemUnit = item.unit
        this.editItemValue = item.value
        this.editModalOpen = true
      },
      async updateItem() {
        try {
          await axios.put(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items/${this.editItemId}`, {
            description: this.editItemName,
            quantity: this.editItemQuantity,
            unit: this.editItemUnit,
            value: this.editItemValue
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          const item = this.items.find(item => item.id === this.editItemId)
          item.description = this.editItemName
          item.quantity = this.editItemQuantity
          item.unit = this.editItemUnit
          item.value = this.editItemValue
          this.closeEditModal()
        } catch (error) {
          alert('Failed to update item: ' + error.response.data.message)
        }
      },
      confirmDeleteItem(itemId) {
        this.deleteItemId = itemId
        this.deleteModalOpen = true
      },
      async deleteItem() {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.$route.params.listId}/items/${this.deleteItemId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.items = this.items.filter(item => item.id !== this.deleteItemId)
          this.closeDeleteModal()
        } catch (error) {
          alert('Failed to delete item: ' + error.response.data.message)
        }
      },
      closeEditModal() {
        this.editModalOpen = false
        this.editItemId = null
        this.editItemName = ''
        this.editItemQuantity = ''
        this.editItemUnit = ''
        this.editItemValue = ''
      },
      closeDeleteModal() {
        this.deleteModalOpen = false
        this.deleteItemId = null
      }
    },
    created() {
      this.fetchList()
      this.fetchItems()
    }
  }
  </script>
  
  <style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  </style>
  