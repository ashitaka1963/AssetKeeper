<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from '../components/PageHeader.vue';
import DashboardTotalBalance from '../components/Dashboard/DashboardTotalBalance.vue';
import DashboardGroupBalance from '../components/Dashboard/DashboardGroupBalance.vue';
import DashboardAccounts from '../components/Dashboard/DashboardAccounts.vue';

import { useAccountsStore } from '@/stores/accounts';
import { useUsersStore } from '@/stores/users';

import loadingUtils from '../CustomLoading';

const usersStore = useUsersStore();
const accountsStore = useAccountsStore();

const isTop = ref(true);

init();

// ========================================
// Methods
// ========================================
async function init() {
  loadingUtils.startLoading();

  await getAccounts();
  await getUsers();

  loadingUtils.closeLoading();
}

function getAccounts() {
  accountsStore.fetchAccounts();
}

function getUsers() {
  usersStore.fetchUsers();
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
