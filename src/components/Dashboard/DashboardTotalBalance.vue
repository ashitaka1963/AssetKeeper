<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, computed } from 'vue';
import { useAccountsStore } from '@/stores/accounts';
import StackedColumnsChart from '../Charts/StackedColumnsChart.vue';
import { addPlusSign, calculateIncreaseRatio, isPositive, findSameDate } from '@/utils/commonUtils';
import loadingUtils from '../../CustomLoading';

const accountsStore = useAccountsStore();
const selectYear = ref(dayjs().year());
const yearOptions: any[] = [];

for (let i = 0; i < 3; i++) {
  yearOptions.push({
    value: selectYear.value - i,
    label: selectYear.value - i
  });
}

// ========================================
// Computed
// ========================================
async function changeYear() {
  loadingUtils.startLoading();

  await getAccounts();

  loadingUtils.closeLoading();
}

async function getAccounts() {
  await accountsStore.fetchAccounts(selectYear.value);
}

const accounts = computed((): any => {
  return accountsStore.accounts;
});

const lineSeries = computed((): any => {
  const series: any = [];

  accounts.value.forEach((account: any) => {
    const monthlyData: any = [];
    for (let month = 1; month <= 12; month++) {
      monthlyData.push(0);
    }

    account.balances.history.forEach((balance: any) => {
      const balanceYear = dayjs(balance.balance_date).year();
      if (balanceYear == selectYear.value) {
        const monthIndex = dayjs(balance.balance_date).month();
        monthlyData[monthIndex] = balance.amount;
      }
    });

    series.push({
      name: account.accountName,
      data: monthlyData
    });
  });

  return series;
});

const xaxisCategories = computed((): any => {
  const categories: any = [];
  for (let month = 1; month <= 12; month++) {
    // const monthString = month.toString().padStart(2, '0');
    // const date = dayjs(`${selectYear.value}-${monthString}-01`);
    // categories.push(date.format('MM'));
    categories.push(month + '月');
  }

  return categories;
});

// 総資産
const totalAmount = computed((): any => {
  let totalAmount = 0;

  accounts.value.forEach((account: any) => {
    totalAmount += account.latestBalance;
  });

  return totalAmount;
});

// 今月残高
const currentMonthAmount = computed((): number => {
  let currentMonthAmount = 0;

  const monthIndex = dayjs().month();

  lineSeries.value.forEach((account: any) => {
    currentMonthAmount += account.data[monthIndex];
  });

  return currentMonthAmount;
});

// 前月残高
const prevMonthAmount = computed((): number => {
  let prevMonthAmount = 0;

  const monthIndex = dayjs().subtract(1, 'month').month();
  lineSeries.value.forEach((account: any) => {
    prevMonthAmount += account.data[monthIndex];
  });

  return prevMonthAmount;
});

// 前年同月残高
const prevYearAmount = computed((): number => {
  const prevYear = dayjs().subtract(1, 'year');
  let prevYearAmount = 0;

  accounts.value.forEach((account: any) => {
    const balanceAmount = findSameDate(account.balances.history, prevYear, 'month');
    prevYearAmount += balanceAmount;
  });

  return prevYearAmount;
});

const previousMonthComparison = computed((): string => {
  return addPlusSign(currentMonthAmount.value - prevMonthAmount.value);
});

const previousMonthRatio = computed((): string => {
  return calculateIncreaseRatio(currentMonthAmount.value, prevMonthAmount.value);
});

const previousYearComparison = computed((): string => {
  return addPlusSign(currentMonthAmount.value - prevYearAmount.value);
});

const previousYearRatio = computed((): string => {
  return calculateIncreaseRatio(currentMonthAmount.value, prevYearAmount.value);
});
</script>

<template>
  <el-row class="container">
    <el-col :span="6">
      <el-row>
        <el-col :span="24">
          <el-text tag="p" size="large">総資産</el-text>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-text tag="p" size="large">
            ￥
            <el-text tag="span" class="text-primary large-text">{{
              totalAmount.toLocaleString()
            }}</el-text>
          </el-text>
        </el-col>
      </el-row>
      <el-row class="margin-top"><el-text tag="p" size="large">比率</el-text> </el-row>
      <el-row>
        <el-col :span="4" :offset="2">
          <el-text tag="span" size="small" class="text-muted">前月比 </el-text>
        </el-col>
        <el-col :span="18">
          <el-text
            tag="span"
            size="large"
            v-bind:class="
              isPositive(currentMonthAmount - prevMonthAmount) ? 'text-accent' : 'text-primary'
            "
            >{{ previousMonthComparison }}</el-text
          >
          <el-text tag="span"> ( </el-text>
          <el-text
            tag="span"
            v-bind:class="
              isPositive(currentMonthAmount - prevMonthAmount) ? 'text-accent' : 'text-primary'
            "
            >{{ previousMonthRatio }}%</el-text
          >
          <el-text tag="span"> ) </el-text>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">
          <el-text tag="span" size="small" class="text-muted">前年比</el-text>
        </el-col>
        <el-col :span="18">
          <el-text
            tag="span"
            size="large"
            v-bind:class="
              isPositive(currentMonthAmount - prevYearAmount) ? 'text-accent' : 'text-primary'
            "
            >{{ previousYearComparison }}</el-text
          >
          <el-text tag="span"> ( </el-text>
          <el-text
            tag="span"
            v-bind:class="
              isPositive(currentMonthAmount - prevYearAmount) ? 'text-accent' : 'text-primary'
            "
            >{{ previousYearRatio }}%</el-text
          >
          <el-text tag="span"> ) </el-text>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="16">
      <StackedColumnsChart :series="lineSeries" :xaxis="xaxisCategories" />
    </el-col>
    <el-col :span="2">
      <el-select
        v-model="selectYear"
        placeholder="Select"
        size="small"
        style="width: 70px"
        effect="dark"
        class="assetkeeper-select"
        @change="changeYear"
      >
        <el-option
          v-for="item in yearOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-col>
  </el-row>
</template>

<style scoped>
* {
  color: #fefefe;
}

.margin-top {
  margin-top: 50px;
}
</style>
