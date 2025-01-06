<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo à gauche -->
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/logo.png" alt="Myshop Logo" class="logo" />
      </router-link>
 
      <!-- Liens au centre -->
      <ul class="navbar-links">
        <li v-if="user" class="navbar-item">
          <router-link to="/" class="navbar-link">Products</router-link>
        </li>
        <li v-if="user" class="navbar-item">
          <router-link to="/history" class="navbar-link">History</router-link>
        </li>
        <li v-if="user && user.role === 'admin'" class="navbar-item">
          <router-link to="/dashboard" class="navbar-link">Dashboard</router-link>
        </li>
      </ul>
 
      <!-- Liens à droite pour Login et Register -->
      <ul class="navbar-links-right">
        <li v-if="!user" class="navbar-item">
          <router-link to="/login" class="navbar-link">Login</router-link>
        </li>
        <li v-if="!user" class="navbar-item">
          <router-link to="/register" class="navbar-link">Register</router-link>
        </li>
      </ul>
 
      <!-- Icônes à droite -->
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
          const response = await axios.get("http://localhost:1000/sneaker-validation/count");
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
 
/* Liens au centre */
.navbar-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-grow: 1; /* Permet à la section centrale de prendre toute la place disponible */
  justify-content: center; /* Centrer les éléments au centre */
}
 
.navbar-links-right {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: flex-end; /* Positionne les éléments à droite */
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
 
/* Icônes à droite */
.navbar-icons {
  display: flex; /* Aligne les icônes horizontalement */
  justify-content: flex-end; /* Positionne les icônes à droite */
  align-items: center; /* Centre les icônes verticalement */
  gap: 1rem; /* Espace entre les icônes */
}
 
.icon-link {
  display: flex; /* Aligne le contenu en ligne */
  align-items: center; /* Centre verticalement */
  background: none; /* Supprime le fond */
  border: none; /* Supprime les bordures */
  padding: 0; /* Supprime le padding */
  cursor: pointer; /* Montre le curseur interactif */
  text-decoration: none; /* Supprime le soulignement */
}
 
.icon-link:hover .icon {
  transform: scale(1.1); /* Effet de zoom au survol */
}
 
.icon {
  width: 24px; /* Taille de l'icône */
  height: 24px; /* Taille de l'icône */
  transition: transform 0.3s ease; /* Animation au survol */
}
 

</style>