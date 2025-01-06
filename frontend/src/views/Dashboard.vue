<template>
  <div class="dashboard-users">
    <AdminMenu />
    <h1>Manage Users</h1>

    <button @click="toggleUserForm">
      {{ showUserForm ? 'Cancel' : 'Add User' }}
    </button>

    <form v-if="showUserForm" @submit.prevent="createOrUpdateUser">
      <input v-model="newUser.username" placeholder="Name" required />
      <input v-model="newUser.email" placeholder="Email" type="email" required />
      <template v-if="!newUser.id">
        <input v-model="newUser.password" placeholder="Password" type="password" required />
      </template>
      <select v-model="newUser.role" required>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">{{ newUser.id ? 'Update' : 'Add' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(user)" class="edit-button">Edit</button>
            <button @click="deleteUser(user.id)" class="delete-button">Delete</button>
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
        const response = await axios.get('http://localhost:1000/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Unable to fetch users.');
      }
    },
    async createOrUpdateUser() {
      try {
        if (this.newUser.id) {
          await axios.patch(`http://localhost:1000/users/${this.newUser.id}`, {
            username: this.newUser.username,
            email: this.newUser.email,
            role: this.newUser.role,
          });
          alert('User updated successfully.');
        } else {
          await axios.post('http://localhost:1000/users', this.newUser);
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
        await axios.delete(`http://localhost:1000/users/${userId}`);
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
  background-color: #fff;
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

button {
  padding: 0.5rem 1rem;
  background-color: #5c3d2e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4a3225;
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
  background-color: #007bff;
}

.edit-button:hover {
  background-color: #0056b3;
}
</style>