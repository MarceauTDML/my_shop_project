<template>
    <div class="admin-menu">
      <h1>Admin Panel</h1>
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard/users" class="menu-link" active-class="active">
              Manage Users
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/categories" class="menu-link" active-class="active">
              Manage Categories
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/products" class="menu-link" active-class="active">
              Manage Products
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminMenu",
  };
  </script>
  
  <style scoped>
  .admin-menu {
    font-family: "Poppins", Arial, sans-serif;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin: 2rem auto;
    max-width: 400px;
    text-align: center;
  }
  
  .admin-menu h1 {
    font-size: 1.8rem;
    color: #826A5C;
    margin-bottom: 1.5rem;
  }
  
  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  nav li {
    margin: 1rem 0;
  }
  
  .menu-link {
    text-decoration: none;
    color: #AE9E95;
    font-weight: bold;
    font-size: 1.2rem;
    transition: color 0.3s ease;
  }
  
  .menu-link:hover {
    color: #5c3d2e;
  }
  
  .active {
    color: #5c3d2e;
  }
  </style>
  