<template>
  <div class="dashboard-categories" aria-label="Category Management Dashboard">
    <AdminMenu />
    <h1>Manage Categories</h1>

    <button @click="toggleCategoryForm" class="add" aria-label="Toggle Add Category Form">
      {{ showCategoryForm ? 'Cancel' : 'Add Category' }}
    </button>

    <form v-if="showCategoryForm" @submit.prevent="createOrUpdateCategory" aria-label="Category Form">
      <input v-model="newCategory.name" placeholder="Category Name" required aria-label="Category Name" />
      <button type="submit" aria-label="{{ newCategory.id ? 'Update Category' : 'Add Category' }}">{{ newCategory.id ? 'Update' : 'Add' }}</button>
    </form>

    <table aria-label="Category List">
      <thead>
        <tr>
          <th class="table-header">ID</th>
          <th class="table-header">Name</th>
          <th class="table-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id" aria-label="Category {{ category.name }}">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <button @click="editCategory(category)" class="edit-button" aria-label="Edit {{ category.name }}">Edit</button>
            <button @click="deleteCategory(category.id)" class="delete-button" aria-label="Delete {{ category.name }}">Delete</button>
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
  name: 'DashboardCategories',
  components: {
    AdminMenu,
  },
  data() {
    return {
      categories: [],
      newCategory: { id: null, name: '' },
      showCategoryForm: false,
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('https://api.ecommerce.marceautdml.com/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Unable to fetch categories.');
      }
    },
    async createOrUpdateCategory() {
      try {
        if (this.newCategory.id) {
          await axios.put(`https://api.ecommerce.marceautdml.com/categories/${this.newCategory.id}`, {
            name: this.newCategory.name,
          });
          alert('Category updated successfully.');
        } else {
          await axios.post('https://api.ecommerce.marceautdml.com/categories', this.newCategory);
          alert('Category added successfully.');
        }
        this.fetchCategories();
        this.resetForm();
      } catch (error) {
        console.error('Error saving category:', error);
        alert('Failed to save category.');
      }
    },
    async deleteCategory(categoryId) {
      try {
        await axios.delete(`https://api.ecommerce.marceautdml.com/categories/${categoryId}`);
        this.fetchCategories();
        alert('Category deleted successfully.');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    },
    editCategory(category) {
      this.newCategory = { ...category };
      this.showCategoryForm = true;
    },
    resetForm() {
      this.newCategory = { id: null, name: '' };
      this.showCategoryForm = false;
    },
    toggleCategoryForm() {
      this.showCategoryForm = !this.showCategoryForm;
      if (!this.showCategoryForm) {
        this.resetForm();
      }
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
.dashboard-categories {
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

button {
  padding: 0.5rem 1rem;
  background-color: #ef796e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.table-header {
  background-color: #D3D3D3;
}

.add {
  background-color: #AE9E95;
}

button:hover {
  background-color: #4a3225;
}

form {
  margin-top: 1rem;
}

form input {
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
</style>