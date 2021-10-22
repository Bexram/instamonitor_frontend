<template>
  <div id="app">
    <app/>
  </div>
</template>

<script>
import app from './components/appMainPage.vue'

export default {
  name: 'App',
  components: {
    app
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
