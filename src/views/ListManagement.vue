<!-- frontend/src/views/ListManagement.vue -->

<template>
    <div>
      <h1>List Management</h1>
  
      <!-- Form to create a new list -->
      <form @submit.prevent="createList">
        <div>
          <label for="listName">List Name:</label>
          <input type="text" id="listName" v-model="newListName" required>
        </div>
        <button type="submit">Create List</button>
      </form>
  
      <!-- Table to display lists -->
      <table>
        <thead>
          <tr>
            <th>List Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="list in lists" :key="list.id">
            <td>{{ list.name }}</td>
            <td>
              <button @click="viewList(list.id)">View Items</button>
              <button @click="editList(list.id)">Edit Name</button>
              <button @click="confirmDeleteList(list.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal for edit confirmation -->
      <div v-if="editModalOpen" class="modal">
        <div class="modal-content">
          <h2>Edit List Name</h2>
          <form @submit.prevent="updateList">
            <div>
              <label for="editListName">New List Name:</label>
              <input type="text" id="editListName" v-model="editListName" required>
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
          <p>Are you sure you want to delete this list?</p>
          <button @click="deleteList">Yes, delete it</button>
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
        newListName: '',
        lists: [],
        editModalOpen: false,
        deleteModalOpen: false,
        editListId: null,
        editListName: '',
        deleteListId: null
      }
    },
    methods: {
      async createList() {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/lists`, {
            name: this.newListName
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.lists.push(response.data)
          this.newListName = ''
        } catch (error) {
          alert('Failed to create list: ' + error.response.data.message)
        }
      },
      async fetchLists() {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.lists = response.data
        } catch (error) {
          alert('Failed to fetch lists: ' + error.response.data.message)
        }
      },
      viewList(listId) {
        this.$router.push(`/lists/${listId}`)
      },
      editList(listId) {
        const list = this.lists.find(list => list.id === listId)
        this.editListId = listId
        this.editListName = list.name
        this.editModalOpen = true
      },
      async updateList() {
        try {
          await axios.put(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.editListId}`, {
            name: this.editListName
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          const list = this.lists.find(list => list.id === this.editListId)
          list.name = this.editListName
          this.closeEditModal()
        } catch (error) {
          alert('Failed to update list: ' + error.response.data.message)
        }
      },
      confirmDeleteList(listId) {
        this.deleteListId = listId
        this.deleteModalOpen = true
      },
      async deleteList() {
        try {
          await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/lists/${this.deleteListId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          this.lists = this.lists.filter(list => list.id !== this.deleteListId)
          this.closeDeleteModal()
        } catch (error) {
          alert('Failed to delete list: ' + error.response.data.message)
        }
      },
      closeEditModal() {
        this.editModalOpen = false
        this.editListId = null
        this.editListName = ''
      },
      closeDeleteModal() {
        this.deleteModalOpen = false
        this.deleteListId = null
      }
    },
    created() {
      this.fetchLists()
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
  