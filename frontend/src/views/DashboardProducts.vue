<template>
  <div class="dashboard">
    <AdminMenu />
    <section>
      <h1>Manage Products</h1>
      <button @click="showProductForm = !showProductForm">
        {{ showProductForm ? 'Annuler' : 'Ajouter un produit' }}
      </button>
      <form v-if="showProductForm" @submit.prevent="createOrUpdateProduct">
        <input v-model="newProduct.name" placeholder="Nom" required />
        <input v-model="newProduct.description" placeholder="Description" />
        <input v-model="newProduct.price" type="number" placeholder="Prix" required />
        <input v-model="newProduct.image" placeholder="URL de l'image" required />
        <select v-model="newProduct.category_id" required>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <button type="submit">{{ newProduct.id ? 'Modifier' : 'Ajouter' }}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Catégorie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price }}</td>
            <td>{{ categories.find(cat => cat.id === product.category_id)?.name }}</td>
            <td>
              <button @click="editProduct(product)" class="edit-button">Modifier</button>
              <button @click="deleteProduct(product.id)" class="delete-button">Supprimer</button>
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
        console.error('Erreur lors de la récupération des produits :', error);
        alert('Impossible de récupérer les produits.');
      }
    },
    async createOrUpdateProduct() {
      try {
        if (this.newProduct.id) {
          await axios.put(`http://localhost:1000/products/${this.newProduct.id}`, this.newProduct);
          alert('Produit modifié avec succès.');
        } else {
          await axios.post('http://localhost:1000/products', this.newProduct);
          alert('Produit ajouté avec succès.');
        }
        this.fetchProducts();
        this.showProductForm = false;
        this.newProduct = { id: null, name: '', description: '', price: '', image: '', category_id: '' };
      } catch (error) {
        console.error('Erreur lors de la création ou modification du produit :', error);
        alert('Impossible de créer ou modifier le produit.');
      }
    },
    async deleteProduct(productId) {
      try {
        await axios.delete(`http://localhost:1000/products/${productId}`);
        this.fetchProducts();
        alert('Produit supprimé avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error);
        alert('Impossible de supprimer le produit.');
      }
    },
    editProduct(product) {
      this.newProduct = { ...product };
      this.showProductForm = true;
    },

    // Gestion des catégories
    async fetchCategories() {
      try {
        const { data } = await axios.get('http://localhost:1000/categories');
        this.categories = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        alert('Impossible de récupérer les catégories.');
      }
    },
    async createOrUpdateCategory() {
      try {
        if (this.newCategory.id) {
          await axios.put(`http://localhost:1000/categories/${this.newCategory.id}`, this.newCategory);
          alert('Catégorie modifiée avec succès.');
        } else {
          await axios.post('http://localhost:1000/categories', this.newCategory);
          alert('Catégorie ajoutée avec succès.');
        }
        this.fetchCategories();
        this.showCategoryForm = false;
        this.newCategory = { id: null, name: '' };
      } catch (error) {
        console.error('Erreur lors de la création ou modification de la catégorie :', error);
        alert('Impossible de créer ou modifier la catégorie.');
      }
    },
    async deleteCategory(categoryId) {
      try {
        await axios.delete(`http://localhost:1000/categories/${categoryId}`);
        this.fetchCategories();
        alert('Catégorie supprimée avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie :', error);
        alert('Impossible de supprimer la catégorie.');
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
  background-color: #fff8f0;
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

button {
  padding: 0.5rem 1rem;
  background-color: #5c3d2e;
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
  background-color: #007bff;
}

.edit-button:hover {
  background-color: #0056b3;
}
</style>