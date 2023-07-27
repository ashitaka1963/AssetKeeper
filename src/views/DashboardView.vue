<script setup lang="ts">
// import TheWelcome from '../components/Dashboard/TheWelcome.vue
import PageHeader from '../components/PageHeader.vue';
import DashboardMain from '../components/Dashboard/DashboardMain.vue';
import DashboardDonut from '../components/Dashboard/DashboardDonut.vue';
import DashboardAccounts from '../components/Dashboard/DashboardAccounts.vue';
</script>

<template>
  <main>
    <PageHeader headerName="Dashboard" />
    <DashboardMain />
    <DashboardDonut />
    <PageHeader headerName="Accounts" />
    <DashboardAccounts />
  </main>
</template>
