<template>
  <div class="login" aria-label="Login Page">
    <h1>Login</h1>
    <form @submit.prevent="loginUser" aria-label="Login Form">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required aria-label="Email Input" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" required aria-label="Password Input" />
      </div>
      <button class="primary-button" type="submit" aria-label="Submit Login Form">Login</button>
    </form>
  </div>
</template>
  
<script>
import axios from 'axios';
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('http://localhost:1000/login', this.form);
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        this.$store.commit('setUser', user);
        if (user.role === 'ADMIN') {
          this.$router.push('/dashboard');
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Error during login:', error.message);
        alert('Invalid credentials. Please try again.');
      }
    },
  },
};
</script>  
  
<style>
.login {
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
  justify-content: left;
  text-align: center;
}

.login h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: #826A5C;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #826A5C;
  text-align: left;
}

input {
  width: 98%;
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
  width: 25%;
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
  margin-top: 1.5rem;
}

.primary-button:hover {
  background-color: #beada3;
}

.primary-button:active {
  transform: translateY(0);
}
</style>