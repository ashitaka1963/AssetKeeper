<script setup lang="ts">
import { ref } from 'vue';
import { useBalancesStore } from '@/stores/balances';

import PageHeader from '../components/PageHeader.vue';
import AccountInfo from '../components/Account/AccountInfo.vue';
import AccountBalance from '../components/Account/AccountBalance.vue';
import AccountHistory from '../components/Account/AccountHistory.vue';

const balancesStore = useBalancesStore();

const isTop = ref(false);

interface Props {
  id: string;
}

const props = defineProps<Props>();
init();

// ========================================
// Methods
// ========================================
async function init() {
  await getBalancesByAccountId();
}

function getBalancesByAccountId() {
  balancesStore.fetchBalancesByAccountId(props.id);
}
</script>

<template>
  <main>
    <PageHeader headerName="Account" :isTop="isTop" />

    <AccountInfo :accountId="props.id" />
    <AccountBalance />
    <AccountHistory :accountId="props.id" />
  </main>
</template>
