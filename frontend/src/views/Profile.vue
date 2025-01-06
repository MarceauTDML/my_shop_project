<template>
  <div class="profile" aria-label="User Profile Page">
    <h1 class="profile-title">My account</h1>
    <div v-if="!user" class="profile-login" aria-label="Login Prompt">
      <p>Please log in to access your profile.</p>
      <router-link to="/login" class="btn-primary" aria-label="Login Button">Login</router-link>
    </div>
    <div v-else aria-label="User Information">
      <div class="profile-info" aria-label="Basic User Information">
        <p aria-label="User Name"><strong>Name :</strong> {{ user.username }}</p>
        <p aria-label="User Email"><strong>Email :</strong> {{ user.email }}</p>
        <p aria-label="User Role"><strong>Role :</strong> {{ user.role }}</p>
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
        console.error('Error fetching description:', error.message);
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
        console.error('Error fetching badges:', error.message);
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
        alert('Description updated successfully!');
      } catch (error) {
        console.error('Error updating description:', error.message);
        alert('Unable to update the description.');
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
        alert('Please select an image.');
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
        alert('Profile picture updated successfully.');
      } catch (error) {
        console.error("Error uploading profile picture:", error.message);
        alert("Unable to update the profile picture.");
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