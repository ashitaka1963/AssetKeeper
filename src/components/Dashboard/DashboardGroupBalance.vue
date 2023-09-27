<script setup lang="ts">
import { computed } from 'vue';
import { useOwnersStore } from '@/stores/owners';
import { useAccountsStore } from '@/stores/accounts';
import DonutChart from '../Charts/DonutChart.vue';

const ownersStore = useOwnersStore();
const accountsStore = useAccountsStore();

// ========================================
// Computed
// ========================================
const owners = computed((): any => {
  return ownersStore.owners;
});

const accounts = computed((): any => {
  return accountsStore.accounts;
});

const lineSeriesPerOwner = computed((): any => {
  let lineSeriesPerOwner: any = [];
  owners.value.forEach((owner: any) => {
    const ownerId = owner.id;

    const filterAccounts = accounts.value.filter((account: any) => {
      return account.ownerId == ownerId;
    });

    let series: Array<number> = [];
    let labels: Array<string> = [];

    filterAccounts.forEach((filterAccount: any) => {
      series.push(filterAccount.balances.latestBalance);
      labels.push(filterAccount.accountName);
    });

    // TODO:lablesが正常に表示されないときがある。処理速度の問題か？

    lineSeriesPerOwner.push({
      ownerName: owner.name,
      series: series,
      labels: labels
    });
  });
  return lineSeriesPerOwner;
});
</script>

<template>
  <el-row class="container">
    <el-col :span="24">
      <el-row>
        <el-col :span="24"> <el-text tag="p" size="large">ユーザ別</el-text></el-col>
      </el-row>
      <el-row class="margin-top">
        <el-col v-for="item in lineSeriesPerOwner" :key="item.ownerName" :span="12">
          {{ item.ownerName }}<DonutChart :series="item.series" :labels="item.labels"
        /></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
* {
  color: #fefefe;
}

.margin-top {
  margin-left: 30px;
  margin-top: 30px;
}
</style>
