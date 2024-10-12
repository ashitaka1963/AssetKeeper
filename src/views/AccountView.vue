<script setup lang="ts">
import { ref } from 'vue';
import { useBalancesStore } from '@/stores/balances';

import PageHeader from '../components/PageHeader.vue';
import AccountInfo from '../components/Account/AccountInfo.vue';
import AccountBalance from '../components/Account/AccountBalance.vue';
import AccountHistory from '../components/Account/AccountHistory.vue';

import loadingUtils from '../CustomLoading';

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
  loadingUtils.startLoading();

  await getBalancesByAccountId();

  loadingUtils.closeLoading();
}

function getBalancesByAccountId() {
  balancesStore.fetchBalancesByAccountId(props.id);
}
</script>

<template>
  <main>
    <PageHeader :headerName="$t('form.header.account')" :isTop="isTop" />

    <AccountInfo :accountId="props.id" />
    <AccountBalance />
    <AccountHistory :accountId="props.id" />
  </main>
</template>
