<script setup lang="ts">
import { computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useAccountsStore } from '@/stores/accounts';
import DonutChart from '../Charts/DonutChart.vue';

const usersStore = useUsersStore();
const accountsStore = useAccountsStore();

// ========================================
// Computed
// ========================================
const users = computed((): any => {
  return usersStore.users;
});

const accounts = computed((): any => {
  return accountsStore.accounts;
});

const lineSeriesPerUser = computed((): any => {
  let lineSeriesPerUser: any = [];
  users.value.forEach((user: any) => {
    const userId = user._id;

    const filterAccounts = accounts.value.filter((account: any) => {
      return account.ownerId == userId;
    });

    let series: Array<number> = [];
    let labels: Array<string> = [];

    filterAccounts.forEach((filterAccount: any) => {
      series.push(filterAccount.balances.latestBalance);
      labels.push(filterAccount.accountName);
    });

    lineSeriesPerUser.push({
      userName: user.userName,
      series: series,
      labels: labels
    });
  });
  return lineSeriesPerUser;
});
</script>

<template>
  <el-row class="container">
    <el-col :span="24">
      <el-row>
        <el-col :span="24"> <el-text tag="p" size="large">ユーザ別</el-text></el-col>
      </el-row>
      <el-row class="margin-top">
        <el-col v-for="item in lineSeriesPerUser" :key="item.userName" :span="12">
          {{ item.userName }}<DonutChart :series="item.series" :labels="item.labels"
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
