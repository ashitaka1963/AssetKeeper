<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '../components/PageHeader.vue';
import DashboardTotalAssets from '../components/Dashboard/DashboardTotalAssets.vue';
import DashboardDonut from '../components/Dashboard/DashboardDonut.vue';
import DashboardAccounts from '../components/Dashboard/DashboardAccounts.vue';

import { useAccountsStore } from '@/stores/accounts';
const accountsStore = useAccountsStore();

const isTop = ref(true);

init();

// ========================================
// Methods
// ========================================
async function init() {
  await getAccounts();
}

function getAccounts() {
  accountsStore.fetchAccounts();
}
</script>

<template>
  <main>
    <PageHeader headerName="Dashboard" :isTop="isTop" />
    <DashboardTotalAssets />
    <DashboardDonut />
    <DashboardAccounts />
  </main>
</template>
