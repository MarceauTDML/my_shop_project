<template>
  <div class="dashboard-users" aria-label="User Management Dashboard">
    <div class="admin-menu">
      <AdminMenu />
    </div>
    <h1>Manage Users</h1>

    <button @click="toggleUserForm" class="add" aria-label="Toggle Add User Form">
      {{ showUserForm ? 'Cancel' : 'Add User' }}
    </button>

    <form v-if="showUserForm" @submit.prevent="createOrUpdateUser" aria-label="User Form">
      <input v-model="newUser.username" placeholder="Name" required aria-label="User Name" />
      <input v-model="newUser.email" placeholder="Email" type="email" required aria-label="User Email" />
      <template v-if="!newUser.id">
        <input v-model="newUser.password" placeholder="Password" type="password" required aria-label="User Password" />
      </template>
      <select v-model="newUser.role" required aria-label="User Role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" aria-label="{{ newUser.id ? 'Update User' : 'Add User' }}">{{ newUser.id ? 'Update' : 'Add' }}</button>
    </form>

    <table aria-label="User List">
      <thead>
        <tr>
          <th class="table-header">ID</th>
          <th class="table-header">Name</th>
          <th class="table-header">Email</th>
          <th class="table-header">Role</th>
          <th class="table-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" aria-label="User {{ user.username }}">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(user)" class="edit-button" aria-label="Edit {{ user.username }}">Edit</button>
            <button @click="deleteUser(user.id)" class="delete-button" aria-label="Delete {{ user.username }}">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import AdminMenu from "@/components/AdminMenu.vue";

export default {
  name: 'DashboardUsers',
  components: {
    AdminMenu,
  },
  data() {
    return {
      users: [],
      newUser: { id: null, username: '', email: '', password: '', role: 'user' },
      showUserForm: false,
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('https://api.ecommerce.marceautdml.com/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Unable to fetch users.');
      }
    },
    async createOrUpdateUser() {
      try {
        if (this.newUser.id) {
          await axios.patch(`https://api.ecommerce.marceautdml.com/users/${this.newUser.id}`, {
            username: this.newUser.username,
            email: this.newUser.email,
            role: this.newUser.role,
          });
          alert('User updated successfully.');
        } else {
          await axios.post('https://api.ecommerce.marceautdml.com/users', this.newUser);
          alert('User added successfully.');
        }
        this.fetchUsers();
        this.resetForm();
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Failed to save user.');
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`https://api.ecommerce.marceautdml.com/users/${userId}`);
        this.fetchUsers();
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    },
    editUser(user) {
      this.newUser = { ...user, password: '' };
      this.showUserForm = true;
    },
    resetForm() {
      this.newUser = { id: null, username: '', email: '', password: '', role: 'user' };
      this.showUserForm = false;
    },
    toggleUserForm() {
      this.showUserForm = !this.showUserForm;
      if (!this.showUserForm) {
        this.resetForm();
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.dashboard-users {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fcfcfc;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
  text-align: left;
}

table th {
  background-color: #f4f4f4;
}

.add {
  background-color: #AE9E95;
}

button {
  padding: 0.5rem 1rem;
  background-color: #ef796e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4a3225;
}

.table-header {
  background-color: #D3D3D3;
}

form {
  margin-top: 1rem;
}

form input,
form select {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.edit-button {
  margin-left: 0.5rem;
  background-color: #AE9E95;
}

.edit-button:hover {
  background-color: #AE9E95;
}

.admin-menu {
  width: 100%;
}
</style>