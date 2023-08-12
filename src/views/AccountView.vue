<script setup lang="ts">
import { ref } from 'vue';

import PageHeader from '../components/PageHeader.vue';
import AccountInfo from '../components/Account/AccountInfo.vue';
import AccountBalance from '../components/Account/AccountBalance.vue';
import AccountHistory from '../components/Account/AccountHistory.vue';

const isTop = ref(false);

interface Props {
  id: string;
}

const props = defineProps<Props>();
</script>

<template>
  <main>
    <PageHeader headerName="Account" :isTop="isTop" />
    <AccountInfo :accountId="props.id" />
    <AccountBalance :accountId="props.id" />
    <AccountHistory :accountId="props.id" />
  </main>
</template>
