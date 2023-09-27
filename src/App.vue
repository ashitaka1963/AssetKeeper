<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from './lib/supabaseClient';

import LoginView from './views/LoginView.vue';
import TheSideMenu from './components/TheSideMenu.vue';

const session = ref();

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
</script>

<template>
  <div class="common-layout">
    <el-container v-if="session" :session="session">
      <el-aside class="side-menu" width="80px"><TheSideMenu /></el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
    <el-container v-else>
      <el-main> <LoginView /></el-main>
    </el-container>
  </div>
</template>

<style scoped>
.side-menu {
  background-color: #1f222a;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

<!-- <script setup>
import { ref, onMounted } from 'vue';
import { supabase } from './lib/supabaseClient';

const countries = ref([]);

async function getCountries() {
  const { data } = await supabase.from('users').select();
  countries.value = data;
}

onMounted(() => {
  getCountries();
});
</script>

<template>
  <ul>
    <li v-for="country in countries" :key="country.id">{{ country.name }}</li>
  </ul>
</template> -->
