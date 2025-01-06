<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="name">First Name</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input id="lastName" v-model="form.lastName" type="text" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <button class="primary-button" type="submit">Register</button>
    </form>
  </div>
</template>
  
<script>
import axios from 'axios';
export default {
  name: 'Register',
  data() {
    return {
      form: {
        lastName: '',
        name: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post('http://localhost:1000/register', this.form);
        alert('Registration successful!');
        this.$router.push('/login');
      }
      catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred during registration. Please try again.');
      }
    },
  },
};
</script>
  
<style>
.register {
  max-width: 600px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: #fcfcfc;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', Arial, sans-serif;
  color: #826A5C;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
}

.register h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: #826A5C;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%; /* S'assurer que les éléments prennent toute la largeur du parent */
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #826A5C;
  text-align: left; /* Alignement du texte des labels à gauche */
}

input {
  width: 90%; /* S'assurer que les champs prennent 100% de la largeur disponible */
  padding: 0.7rem;
  border: 1px solid #CCC2BC;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  font-size: 1rem;
  color: #826A5C;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #b2a9a4;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.primary-button {
  padding: 0.7rem;
  background-color: #AE9E95;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 1.5rem; /* Ajouter un espace entre le formulaire et le bouton */
}

.primary-button:hover {
  background-color: #beada3;
}

.primary-button:active {
  transform: translateY(0);
}
</style>