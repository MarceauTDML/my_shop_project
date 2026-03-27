<template>
  <div class="register" aria-label="User Registration Page">
    <h1>Register</h1>
    <form @submit.prevent="registerUser" aria-label="Registration Form">
      <div class="form-group">
        <label for="name">First Name</label>
        <input id="name" v-model="form.name" type="text" required aria-label="First Name Input" />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input id="lastName" v-model="form.lastName" type="text" required aria-label="Last Name Input" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required aria-label="Email Input" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          aria-label="Password Input"
        />
        <p v-if="passwordError" class="error" aria-live="polite" aria-label="Password Error">{{ passwordError }}</p>
      </div>
      <button class="primary-button" type="submit" aria-label="Submit Registration Form">Register</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      form: {
        lastName: "",
        name: "",
        email: "",
        password: "",
      },
      passwordError: null,
    };
  },
  methods: {
    validatePassword(password) {
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{11,}$/;
      if (!passwordRegex.test(password)) {
        return (
          "Password must be at least 11 characters long, include at least one number and one special character."
        );
      }
      return null;
    },
    async registerUser() {
      this.passwordError = this.validatePassword(this.form.password);
      if (this.passwordError) {
        return;
      }
      try {
        const response = await axios.post(
          "https://api.ecommerce.marceautdml.com/register",
          this.form
        );
        alert("Registration successful!");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error registering user:", error.message);
        alert("An error occurred during registration. Please try again.");
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
  width: 90%;
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
  margin-top: 1.5rem;
}

.primary-button:hover {
  background-color: #beada3;
}

.primary-button:active {
  transform: translateY(0);
}
</style>