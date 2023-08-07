<script setup lang="ts">
import { ref } from 'vue';

import PageHeader from '../components/PageHeader.vue';
import AccountDetailInfo from '../components/AccountDetail/AccountDetailInfo.vue';
import AccountDetailBalance from '../components/AccountDetail/AccountDetailBalance.vue';
import AccountDetailTransactions from '../components/AccountDetail/AccountDetailTransactions.vue';

const isTop = ref(false);

interface Props {
  id: string;
}

const props = defineProps<Props>();
</script>

<template>
  <main>
    <PageHeader headerName="AccountDetail" :isTop="isTop" />
    <AccountDetailInfo :accountId="props.id" />
    <AccountDetailBalance :accountId="props.id" />
    <AccountDetailTransactions :accountId="props.id" />
  </main>
</template>
