<template>
  <div class="profile">
    <h1 class="profile-title">My account</h1>
    <div v-if="!user" class="profile-login">
      <p>Please log in to access your profile.</p>
      <router-link to="/login" class="btn-primary">Login</router-link>
    </div>
    <div v-else>
      <div class="profile-info">
        <p><strong>Name :</strong> {{ user.username }}</p>
        <p><strong>Email :</strong> {{ user.email }}</p>
        <p><strong>Role :</strong> {{ user.role }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
export default {
  name: 'Profile',
  data() {
    return {
      description: '',
      editingDescription: false,
      unlockedBadges: [],
      lockedBadges: [],
      selectedImage: null,
    };
  },
  computed: {
    ...mapState(['user']),
    profileImageUrl() {
      return this.user?.profile_image
        ? `http://localhost:1000/${this.user.profile_image}`
        : null;
    },
  },
  methods: {
    async fetchDescription() {
      try {
        const response = await axios.get(
          `http://localhost:1000/users/${this.user.id}/description`,
          { headers: { Authorization: `Bearer ${this.user.token}` } }
        );
        this.description = response.data.description;
      } catch (error) {
        console.error('Erreur lors de la récupération de la description :', error.message);
      }
    },
    async fetchBadges() {
      try {
        const allBadges = await axios.get('http://localhost:1000/badges');
        const unlockedBadges = await axios.get(
          `http://localhost:1000/users/${this.user.id}/badges`,
          { headers: { Authorization: `Bearer ${this.user.token}` } }
        );
        const unlockedIds = unlockedBadges.data.map(badge => badge.id);

        this.unlockedBadges = unlockedBadges.data;
        this.lockedBadges = allBadges.data.filter(badge => !unlockedIds.includes(badge.id));
      } catch (error) {
        console.error('Erreur lors de la récupération des badges :', error.message);
      }
    },
    async saveDescription() {
      try {
        await axios.put(
          `http://localhost:1000/users/${this.user.id}/description`,
          { description: this.description },
          { headers: { Authorization: `Bearer ${this.user.token}` } }
        );
        this.editingDescription = false;
        alert('Description mise à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la description :', error.message);
        alert('Impossible de mettre à jour la description.');
      }
    },
    startEditing() {
      this.editingDescription = true;
    },
    handleFileUpload(event) {
      this.selectedImage = event.target.files[0];
    },
    async uploadProfileImage() {
      if (!this.selectedImage) {
        alert('Veuillez sélectionner une image.');
        return;
      }
      const formData = new FormData();
      formData.append('profile_image', this.selectedImage);
      try {
        const response = await axios.post(
          `http://localhost:1000/users/${this.user.id}/profile-image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${this.user.token}`,
            },
          }
        );
        const updatedUser = { ...this.user, profile_image: response.data.profile_image };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.$store.commit('setUser', updatedUser);
        alert('Photo de profil mise à jour avec succès.');
      } catch (error) {
        console.error("Erreur lors de l'upload de la photo de profil :", error.message);
        alert("Impossible de mettre à jour la photo de profil.");
      }
    },
  },
  mounted() {
    if (this.user) {
      this.fetchDescription();
      this.fetchBadges();
    }
  },
};
</script>

<style scoped>
.profile {
  font-family: 'Poppins', Arial, sans-serif;
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fcfcfc;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-title {
  text-align: center;
  color: #826A5C;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.profile-info p {
  font-size: 1.1rem;
  color: #826A5C;
  margin: 0.5rem 0;
}

.profile-description textarea {
  width: 100%;
  height: 100px;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
}

.badges-title {
  margin-top: 1.5rem;
  color: #5c3d2e;
}

.badge-list {
  list-style-type: none;
  padding: 0;
}

.badge-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.7rem;
  margin-bottom: 0.5rem;
  color: #5c3d2e;
}

.locked-badge {
  color: #999;
}

.btn-primary {
  background-color: #d4b896;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #b29379;
}
</style>