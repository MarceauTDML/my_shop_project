import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Cart from '@/views/Cart.vue';
import Profile from '@/views/Profile.vue';
import History from '@/views/History.vue';
import DashboardCategories from "@/views/DashboardCategories.vue";
import DashboardProducts from "@/views/DashboardProducts.vue";

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/dashboard/users',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role === 'admin') {
        next();
      } else {
        alert('Accès refusé : vous n\'êtes pas autorisé à consulter cette page.');
        next('/');
      }
    },
  },
  {
    path: "/dashboard/categories",
    component: DashboardCategories,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "admin") {
        next();
      } else {
        alert("Access Denied: Admins Only");
        next("/");
      }
    },
  },
  {
    path: "/dashboard/products",
    component: DashboardProducts,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "admin") {
        next();
      } else {
        alert("Access Denied: Admins Only");
        next("/");
      }
    },
  },
  {
    path: '/cart',
    component: Cart,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        next();
      } else {
        alert('Veuillez vous connecter pour accéder à votre liste de souhaits.');
        next('/login');
      }
    },
  },
  {
    path: '/profile',
    component: Profile,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        next();
      } else {
        alert('Veuillez vous connecter pour accéder à votre profil.');
        next('/login');
      }
    },
  },
  {
    path: '/history',
    component: History,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        next();
      } else {
        alert('Veuillez vous connecter pour accéder à votre historique.');
        next('/login');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;