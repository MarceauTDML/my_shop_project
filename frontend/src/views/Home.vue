<template>
  <div class="home" aria-label="Home Page">
    <div class="filters" aria-label="Product Filters">
      <input type="text" v-model="searchQuery" placeholder="Search..." aria-label="Search products by name or brand" />
      <input type="number" v-model.number="minPrice" placeholder="Minimum price" min="0" aria-label="Minimum Price" />
      <input type="number" v-model.number="maxPrice" :min="minPrice" placeholder="Maximum price" aria-label="Maximum Price" />
      <button @click="applyFilters" aria-label="Apply Filters">Apply filters</button>
      <button @click="resetFilters" aria-label="Reset Filters">Reset filters</button>
    </div>
     <div class="product-list" aria-label="Product List">
      <div 
        class="product-card" 
        v-for="product in filteredProducts" 
        :key="product.id" 
        @click="openModal(product)" 
        :aria-label="`Product card for ${product.name}`">
        <img :src="product.image" class="product-image" :alt="`${product.name} image`" />
        <p aria-label="Product Name">{{ product.name }}</p>
        <p aria-label="Product Price">{{ product.price }} €</p>
        <button 
          class="btn-primary" 
          @click.stop="addToCart(product.id)" 
          :aria-label="`Add ${product.name} to cart`">
          Add to Cart
        </button>
      </div>
    </div>
     <div v-if="showModal" class="modal-overlay" @click="closeModal" aria-label="Product Details Modal">
      <div class="modal-content" @click.stop aria-label="Product Details">
        <button class="close-button" @click="closeModal" aria-label="Close Product Modal">&times;</button>
        <img :src="selectedProduct.image" class="modal-product-image" :alt="`${selectedProduct.name} image`" />
        <h2>{{ selectedProduct.name }}</h2>
        <p>{{ selectedProduct.description }}</p>
        <p><strong>Price:</strong> {{ selectedProduct.price }} €</p>
        <button 
          class="btn-primary" 
          @click="addToCart(selectedProduct.id)" 
          :aria-label="`Add ${selectedProduct.name} to cart from modal`">
          Add to Cart
        </button>
      </div>
    </div>
     <div class="pagination" v-if="meta.totalPages > 1" aria-label="Pagination Controls">
      <button 
        class="pagination-button" 
        @click="changePage(meta.currentPage - 1)" 
        :disabled="meta.currentPage === 1" 
        aria-label="Previous Page">
        Previous
      </button>
      <span
        v-for="page in meta.totalPages"
        :key="page"
        :class="{ 'active-page': page === meta.currentPage }"
        @click="changePage(page)"
        class="pagination-page"
        :aria-label="`Page ${page}`">
        {{ page }}
      </span>
      <button 
        class="pagination-button" 
        @click="changePage(meta.currentPage + 1)" 
        :disabled="meta.currentPage === meta.totalPages" 
        aria-label="Next Page">
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
        itemsPerPage: 8,
      },
      showModal: false,
      selectedProduct: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async fetchProducts(page = 1) {
      try {
        const response = await axios.get("https://api.ecommerce.marceautdml.com/products", {
          params: { page, limit: this.meta.itemsPerPage },
        });
        this.products = response.data.data;
        this.meta.currentPage = response.data.meta.currentPage;
        this.meta.totalPages = response.data.meta.totalPages;
         this.filteredProducts = this.products;
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    },
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
     resetFilters() {
      this.searchQuery = "";
      this.minPrice = null;
      this.maxPrice = null;
      this.filteredProducts = this.products;
    },
     async addToCart(productId) {
      if (!this.user) {
        alert("Please login to add items to the cart.");
        return;
      }
      try {
        await axios.post("https://api.ecommerce.marceautdml.com/cart", {
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
     openModal(product) {
      this.selectedProduct = product;
      this.showModal = true;
    },
     closeModal() {
      this.showModal = false;
      this.selectedProduct = {};
    },
     async changePage(page) {
      if (page < 1 || page > this.meta.totalPages) return;
      await this.fetchProducts(page);
    },
  },
  mounted() {
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
 
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  max-width: 1300px;
  gap: 2rem;
  margin-top: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-left: auto;
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