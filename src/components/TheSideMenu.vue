<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <!-- TODO:SideMenu -->

  <RouterLink v-bind:to="{ name: 'DashboardView' }"
    ><el-button type="info" link>HOME</el-button></RouterLink
  >
</template>

<style scoped>
/* .container {
  background-color: #30343d;
  padding: 30px 40px;
  border-radius: 4px;
} */
</style>
