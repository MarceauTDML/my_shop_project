<template>
  <div class="dashboard" aria-label="Product Management Dashboard">
    <AdminMenu />
    <section>
      <h1>Manage Products</h1>
      <button @click="showProductForm = !showProductForm" class="add" aria-label="Toggle Product Form">
        {{ showProductForm ? 'Cancel' : 'Add Product' }}
      </button>
      <form v-if="showProductForm" @submit.prevent="createOrUpdateProduct" aria-label="Product Form">
        <input v-model="newProduct.name" placeholder="Name" required aria-label="Product Name" />
        <input v-model="newProduct.description" placeholder="Description" aria-label="Product Description" />
        <input v-model="newProduct.price" type="number" placeholder="Price" required aria-label="Product Price" />
        <input v-model="newProduct.image" placeholder="Image URL" required aria-label="Product Image URL" />
        <select v-model="newProduct.category_id" required aria-label="Select Category">
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <button type="submit" aria-label="{{ newProduct.id ? 'Update Product' : 'Add Product' }}">
          {{ newProduct.id ? 'Update' : 'Add' }}
        </button>
      </form>
      <table aria-label="Product List">
        <thead>
          <tr>
            <th class="table-header">ID</th>
            <th class="table-header">Name</th>
            <th class="table-header">Description</th>
            <th class="table-header">Price</th>
            <th class="table-header">Category</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" aria-label="Product {{ product.name }}">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price }}</td>
            <td>{{ categories.find(cat => cat.id === product.category_id)?.name }}</td>
            <td>
              <button @click="editProduct(product)" class="edit-button" aria-label="Edit {{ product.name }}">Edit</button>
              <button @click="deleteProduct(product.id)" class="delete-button" aria-label="Delete {{ product.name }}">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import AdminMenu from "@/components/AdminMenu.vue";
export default {
  name: 'DashboardProducts',
  components: {
    AdminMenu,
  },
  data() {
    return {
      users: [],
      products: [],
      categories: [],
      newUser: { id: null, username: '', email: '', password: '', role: 'user' },
      newProduct: { id: null, name: '', description: '', price: '', image: '', category_id: '' },
      newCategory: { id: null, name: '' },
      showUserForm: false,
      showProductForm: false,
      showCategoryForm: false,
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const { data } = await axios.get('http://localhost:1000/products');
        this.products = data.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Unable to fetch products.');
      }
    },
    async createOrUpdateProduct() {
      try {
        if (this.newProduct.id) {
          await axios.put(`http://localhost:1000/products/${this.newProduct.id}`, this.newProduct);
          alert('Product updated successfully.');
        } else {
          await axios.post('http://localhost:1000/products', this.newProduct);
          alert('Product added successfully.');
        }
        this.fetchProducts();
        this.showProductForm = false;
        this.newProduct = { id: null, name: '', description: '', price: '', image: '', category_id: '' };
      } catch (error) {
        console.error('Error creating or updating product:', error);
        alert('Failed to create or update product.');
      }
    },
    async deleteProduct(productId) {
      try {
        await axios.delete(`http://localhost:1000/products/${productId}`);
        this.fetchProducts();
        alert('Product deleted successfully.');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    },
    editProduct(product) {
      this.newProduct = { ...product };
      this.showProductForm = true;
    },
    async fetchCategories() {
      try {
        const { data } = await axios.get('http://localhost:1000/categories');
        this.categories = data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Unable to fetch categories.');
      }
    },
    async createOrUpdateCategory() {
      try {
        if (this.newCategory.id) {
          await axios.put(`http://localhost:1000/categories/${this.newCategory.id}`, this.newCategory);
          alert('Category updated successfully.');
        } else {
          await axios.post('http://localhost:1000/categories', this.newCategory);
          alert('Category added successfully.');
        }
        this.fetchCategories();
        this.showCategoryForm = false;
        this.newCategory = { id: null, name: '' };
      } catch (error) {
        console.error('Error creating or updating category:', error);
        alert('Failed to create or update category.');
      }
    },
    async deleteCategory(categoryId) {
      try {
        await axios.delete(`http://localhost:1000/categories/${categoryId}`);
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
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
  },
};
</script>

<style>
.dashboard {
  max-width: 900px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: #fcfcfc;
  border: 1px solid #e6dfd8;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', Arial, sans-serif;
  color: #5c3d2e;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th, table td {
  padding: 0.75rem;
  border: 1px solid #e6dfd8;
  text-align: left;
}

table th {
  background-color: #d4b896;
  color: white;
  font-weight: bold;
}

.add {
  background-color: #AE9E95;
}

.table-header {
  background-color: #D3D3D3;
}

button {
  padding: 0.5rem 1rem;
  background-color: #ef796e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4a3225;
}

form {
  margin-top: 1rem;
}

form input, form select {
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #e6dfd8;
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