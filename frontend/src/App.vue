<template>
  <div id="app">
    <NavBar :user="user" @logout="logout" />
    <router-view />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import NavBar from './components/NavBar.vue';
export default {
  name: 'App',
  components: { NavBar },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['setUser']),
    logout() {
      this.setUser(null);
      this.$router.push('/login');
    },
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: white;
}
#app {
  text-align: center;
}
</style>
