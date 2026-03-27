<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/logo.png" alt="Myshop Logo" class="logo" />
      </router-link>
      <ul class="navbar-links">
        <li v-if="user" class="navbar-item">
          <router-link to="/" class="navbar-link">Products</router-link>
        </li>
        <li v-if="user" class="navbar-item">
          <router-link to="/history" class="navbar-link">History</router-link>
        </li>
        <li v-if="user && user.role === 'admin'" class="navbar-item">
          <router-link to="/dashboard/users" class="navbar-link">Dashboard</router-link>
        </li>
      </ul>
       <ul class="navbar-links-right">
        <li v-if="!user" class="navbar-item">
          <router-link to="/login" class="navbar-link">Login</router-link>
        </li>
        <li v-if="!user" class="navbar-item">
          <router-link to="/register" class="navbar-link">Register</router-link>
        </li>
      </ul>
       <div class="navbar-icons">
        <router-link v-if="user" to="/cart" class="icon-link">
          <img src="@/assets/bag-icon.svg" alt="Cart Icon" class="icon" />
        </router-link>
        <router-link v-if="user" to="/profile" class="icon-link">
          <img src="@/assets/user-icon.svg" alt="User Icon" class="icon" />
        </router-link>
        <button v-if="user" @click="logout" class="icon-link">
          <img src="@/assets/logout-icon.svg" alt="Logout Icon" class="icon" />
        </button>
      </div>
    </div>
  </nav>
</template>
 
<script>
import axios from "axios";
export default {
  name: "NavBar",
  props: ["user"],
  data() {
    return {
      validationCount: 0,
      isMenuOpen: false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$emit("logout");
    },
    async fetchValidationCount() {
      if (this.user && this.user.role === "ADMIN") {
        try {
          const response = await axios.get("https://api.ecommerce.marceautdml.com/sneaker-validation/count");
          this.validationCount = response.data.count;
        } catch (error) {
          console.error("Erreur lors de la récupération des validations :", error.message);
        }
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
  mounted() {
    this.fetchValidationCount();
    this.interval = setInterval(this.fetchValidationCount, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
 
<style scoped>
.navbar {
  background-color: #AFABA7;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2px 20px;
  font-family: 'Arial', sans-serif;
}
 
.navbar-container {
  display: flex;
  justify-content: space-between; /* Espace entre la partie gauche, centrale et droite */
  align-items: center;
  width: 100%;
}
 
.logo {
  display: flex;
  align-items: center;
  width: 85px;
  height: auto;
}
 
.navbar-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-grow: 1;
  justify-content: center;
}
 
.navbar-links-right {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: flex-end;
}
 
.navbar-item {
  display: flex;
  align-items: center;
}
 
.navbar-link {
  font-size: 1rem;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s;
}
 
.navbar-link:hover {
  color: #e2e2e2;
}
 
.navbar-icons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}
 
.icon-link {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
}
 
.icon-link:hover .icon {
  transform: scale(1.1);
}
 
.icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

</style>