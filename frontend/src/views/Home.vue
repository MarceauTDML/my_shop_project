<template>
  <div class="home">
    <!-- Filtres -->
    <div class="filters">
      <input type="text" v-model="searchQuery" placeholder="Search..." />
      <input type="number" v-model.number="minPrice" placeholder="Minimum price" min="0" />
      <input type="number" v-model.number="maxPrice" :min="minPrice" placeholder="Maximum price" />
      <button @click="applyFilters">Apply filters</button>
      <button @click="resetFilters">Reset filters</button>
    </div>
 
    <!-- Liste des produits -->
    <div class="product-list">
      <div class="product-card" v-for="product in filteredProducts" :key="product.id" @click="openModal(product)">
        <img :src="product.image" class="product-image" />
        <p>{{ product.name }}</p>
        <p>{{ product.price }} €</p>
        <button class="btn-primary" @click.stop="addToCart(product.id)">Add to Cart</button>
      </div>
    </div>
 
    <!-- Modale Produit -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">&times;</button>
        <img :src="selectedProduct.image" class="modal-product-image" />
        <h2>{{ selectedProduct.name }}</h2>
        <p>{{ selectedProduct.description }}</p>
        <p><strong>Price:</strong> {{ selectedProduct.price }} €</p>
        <button class="btn-primary" @click="addToCart(selectedProduct.id)">Add to Cart</button>
      </div>
    </div>
 
    <!-- Pagination -->
    <div class="pagination" v-if="meta.totalPages > 1">
      <button class="pagination-button" @click="changePage(meta.currentPage - 1)" :disabled="meta.currentPage === 1">
        Previous
      </button>
      <span
        v-for="page in meta.totalPages"
        :key="page"
        :class="{ 'active-page': page === meta.currentPage }"
        @click="changePage(page)"
        class="pagination-page"
      >
        {{ page }}
      </span>
      <button class="pagination-button" @click="changePage(meta.currentPage + 1)" :disabled="meta.currentPage === meta.totalPages">
        Next
      </button>
    </div>
  </div>
</template>
 
<script>
import axios from "axios";
import { mapState } from "vuex";
 
export default {
  name: "Home",
  data() {
    return {
      products: [],
      searchQuery: "",
      minPrice: null,
      maxPrice: null,
      filteredProducts: [],
      meta: {
        currentPage: 1,
        totalPages: 0,
        itemsPerPage: 8, // Nombre de produits par page
      },
      showModal: false,
      selectedProduct: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    // Récupération des produits de l'API
    async fetchProducts(page = 1) {
      try {
        const response = await axios.get("http://localhost:1000/products", {
          params: { page, limit: this.meta.itemsPerPage },
        });
        this.products = response.data.data;
        this.meta.currentPage = response.data.meta.currentPage;
        this.meta.totalPages = response.data.meta.totalPages;
 
        // Mettre à jour les produits filtrés
        this.filteredProducts = this.products;
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    },
 
    // Appliquer les filtres
    applyFilters() {
      this.filteredProducts = this.products.filter((product) => {
        const matchesSearch =
          !this.searchQuery ||
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesMinPrice = this.minPrice === null || product.price >= this.minPrice;
        const matchesMaxPrice = this.maxPrice === null || product.price <= this.maxPrice;
        return matchesSearch && matchesMinPrice && matchesMaxPrice;
      });
    },
 
    // Réinitialiser les filtres
    resetFilters() {
      this.searchQuery = "";
      this.minPrice = null;
      this.maxPrice = null;
      this.filteredProducts = this.products;
    },
 
    // Ajouter au panier
    async addToCart(productId) {
      if (!this.user) {
        alert("Please login to add items to the cart.");
        return;
      }
      try {
        await axios.post("http://localhost:1000/cart", {
          userId: this.user.id,
          productId,
          quantity: 1,
        });
        alert("Product added to cart.");
      } catch (error) {
        console.error("Error adding product to cart:", error.message);
        alert("Unable to add product to cart.");
      }
    },
 
    // Ouvrir la modale
    openModal(product) {
      this.selectedProduct = product;
      this.showModal = true;
    },
 
    // Fermer la modale
    closeModal() {
      this.showModal = false;
      this.selectedProduct = {};
    },
 
    // Changer la page
    async changePage(page) {
      if (page < 1 || page > this.meta.totalPages) return;
      await this.fetchProducts(page);
    },
  },
  mounted() {
    // Charger les produits de la première page
    this.fetchProducts();
  },
};
</script>
 
<style scoped>
.home {
  font-family: "Poppins", Arial, sans-serif;
  color: #826A5C;
  background-color: #f9f9f9;
  max-width: 100%;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  box-sizing: border-box;
}
 
/* Filtres */
.filters {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.filters input[type="text"],
.filters input[type="number"] {
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  width: 200px;
}
.filters button {
  background-color: #AE9E95;
  color: white;
  border: none;
  padding: 0.8rem 1.4rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.filters button:hover {
  background-color: #bdada4;
  transform: scale(1.05);
}
 
/* Liste des produits */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Maximum 4 produits par ligne */
  max-width: 1300px;
  gap: 2rem; /* Augmenter l'espace entre les cartes */
  margin-top: 1.5rem;
  justify-content: center;  /* Centrer horizontalement */
  align-items: center;      /* Centrer verticalement */
  margin-left: auto;        /* Centrer le conteneur par rapport à l'écran */
  margin-right: auto;
}
.product-card {
  padding: 1.5rem;
  background-color: #EAE9E8;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}
.product-card:hover {
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-10px);
}
.product-image {
  display: block;
  margin: 0 auto 1rem auto;
  max-width: 100%;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
}
.product-card p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #826A5C;
}
.btn-primary {
  background-color: #AE9E95;
  width: 100%;
  color: white;
  padding: 0.8rem 1.4rem;
  border: none;
  border-radius: 0px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.btn-primary:hover {
  background-color: #bdada4;
  transform: scale(1.05);
}
 
/* Modale */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  position: relative;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}
.close-button:hover {
  color: #bdada4;
}
.modal-product-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-bottom: 1rem;
}
 
/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}
.pagination-button {
  background-color: #AE9E95;
  color: white;
  border: none;
  padding: 0.8rem 1.4rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}
.pagination-button:hover:not(:disabled) {
  background-color: #bdada4;
}
.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
.pagination-page {
  cursor: pointer;
  padding: 0.8rem 1.2rem;
  border: 2px solid #AE9E95;
  border-radius: 10px;
  margin: 0 5px;
  color: #333;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.pagination-page:hover {
  background-color: #bdada4;
  color: white;
}
.active-page {
  background-color: #826A5C;
  color: white;
  pointer-events: none;
}
</style>