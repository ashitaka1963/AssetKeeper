<script setup lang="ts">
// import TheWelcome from '../components/Dashboard/TheWelcome.vue
import PageHeader from '../components/PageHeader.vue';
import DashboardMain from '../components/Dashboard/DashboardMain.vue';
import DashboardDonut from '../components/Dashboard/DashboardDonut.vue';
import DashboardAccounts from '../components/Dashboard/DashboardAccounts.vue';

import { useAccountsStore } from '@/stores/accounts';
const accountsStore = useAccountsStore();

init();

// ========================================
// Methods
// ========================================
async function init() {
  await getAccounts();
}

function getAccounts() {
  // alert('in');
  console.log(accountsStore.accounts);
  accountsStore.fetchAccounts();
  console.log(accountsStore.accounts);
}
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
