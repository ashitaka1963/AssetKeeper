<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '../components/PageHeader.vue';
import DashboardTotalBalance from '../components/Dashboard/DashboardTotalBalance.vue';
import DashboardGroupBalance from '../components/Dashboard/DashboardGroupBalance.vue';
import DashboardAccounts from '../components/Dashboard/DashboardAccounts.vue';

import { useAccountsStore } from '@/stores/accounts';
import { useOwnersStore } from '@/stores/owners';

import loadingUtils from '../CustomLoading';

const ownersStore = useOwnersStore();
const accountsStore = useAccountsStore();

const isTop = ref(true);

init();

// ========================================
// Methods
// ========================================
async function init() {
  loadingUtils.startLoading();

  await getAccounts();
  await getOwners();

  loadingUtils.closeLoading();
}

async function getAccounts() {
  await accountsStore.fetchAccounts();
}

async function getOwners() {
  await ownersStore.fetchOwners();
}
</script>

<template>
  <main>
    <PageHeader headerName="Dashboard" :isTop="isTop" />
    <DashboardTotalBalance />
    <DashboardGroupBalance />
    <DashboardAccounts />
  </main>
</template>
