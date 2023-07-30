<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

// import TheWelcome from '../components/Dashboard/TheWelcome.vue
import PageHeader from '../components/PageHeader.vue';
import AccountDetailInfo from '../components/AccountDetail/AccountDetailInfo.vue';
import AccountDetailBalance from '../components/AccountDetail/AccountDetailBalance.vue';
import AccountDetailTransactions from '../components/AccountDetail/AccountDetailTransactions.vue';

// import DashboardDonut from '../components/Dashboard/DashboardDonut.vue';
// import DashboardAccounts from '../components/Dashboard/DashboardAccounts.vue';

interface Props {
  id: number;
}

const props = defineProps<Props>();

// import { useAccountsStore } from '@/stores/accounts';
// const accountsStore = useAccountsStore();

// ========================================
// Computed
// ========================================
// const account = computed((): any => {
//   return accountsStore.getById(props.id);
// });
// ========================================
// Methods
// ========================================
// async function init() {
//   await getAccounts();
// }

// function getAccounts() {
//   // alert('in');
//   console.log(accountsStore.accounts);
//   accountsStore.fetchAccounts();
//   console.log(accountsStore.accounts);
// }
</script>

<template>
  <main>
    <PageHeader headerName="AccountDetail" />
    <AccountDetailInfo :accountId="props.id" />
    <AccountDetailBalance :accountId="props.id" />
    <AccountDetailTransactions :accountId="props.id" />
  </main>
</template>
