<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, computed } from 'vue';
import { useAccountsStore } from '@/stores/accounts';
import StackedColumnsChart from '../Charts/StackedColumnsChart.vue';

const accountsStore = useAccountsStore();

// ========================================
// Computed
// ========================================
const accounts = computed((): any => {
  return accountsStore.accounts;
});

const lineSeries = computed((): any => {
  const series: any = [];

  const year = 2023; //TODO:2023年固定

  accounts.value.forEach((account: any) => {
    const monthlyData: any = [];
    for (let month = 1; month <= 12; month++) {
      monthlyData.push(null);
    }

    account.balances.history.forEach((balance: any) => {
      const balanceYear = dayjs(balance.balanceDate).year();
      if (balanceYear == year) {
        const monthIndex = dayjs(balance.balanceDate).month();
        monthlyData[monthIndex] = balance.balanceAmount;
      }
    });

    series.push({
      name: account.accountName,
      data: monthlyData
    });
  });

  return series;
});

const totalAmount = computed((): any => {
  let totalAmount = 0;

  accounts.value.forEach((account: any) => {
    totalAmount += account.balances.latestBalance;
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

  // const prevYear = dayjs().subtract(1, 'year');
  // const balanceHistory = account.value.balances.history;
  // const prevYearAmount = findSameDate(balanceHistory, prevYear, 'month');

  return prevYearAmount;
});

// const formattedNumber = computed((): string => {
//   return totalAmount.value.toLocaleString();
// });

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

// ========================================
// Methods
// ========================================
function findSameDate(balanceHistory: Array<T>, targetDate: any, unit: dayjs.OpUnitType): number {
  const foundData = balanceHistory.find((item: any) => {
    const balanceDate = dayjs(item.balanceDate);
    return balanceDate.isSame(targetDate, unit);
  });

  return foundData ? foundData.balanceAmount : 0;
}

function addPlusSign(number: number) {
  if (typeof number === 'number' && Number.isInteger(number)) {
    return number >= 0 ? `+${number.toLocaleString()}` : `${number.toLocaleString()}`;
  } else {
    throw new Error('Invalid input. Please provide an integer.');
  }
}

function calculateIncreaseRatio(currentValue: number, previousValue: number) {
  if (typeof previousValue === 'number' && typeof currentValue === 'number') {
    const increase = currentValue - previousValue;
    // const ratio = (increase / previousValue) * 100;
    const ratio = previousValue !== 0 ? (increase / previousValue) * 100 : 0;
    const formattedRatio = ratio >= 0 ? `+${ratio.toFixed(1)}` : `${ratio.toFixed(1)}`;
    return formattedRatio;
  } else {
    throw new Error(
      'Invalid input. Please provide valid numbers for the previous and current values.'
    );
  }
}

function isPositive(value: number): boolean {
  return value > 0;
}
</script>

<template>
  <el-row class="container">
    <el-col :span="8">
      <el-row>
        <el-col :span="24">
          <el-text tag="p" size="large">総資産</el-text>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-text tag="p" size="large">
            ￥ <el-text tag="span" class="emphasis">{{ totalAmount.toLocaleString() }}</el-text>
          </el-text>
        </el-col>
      </el-row>
      <el-row class="margin-top"><el-text tag="p" size="large">比率</el-text> </el-row>
      <el-row>
        <el-col :span="4" :offset="2">
          <el-text tag="span" size="small" class="black-text">前月比 </el-text>
        </el-col>
        <el-col :span="18">
          <el-text
            tag="span"
            size="large"
            v-bind:class="
              isPositive(currentMonthAmount - prevMonthAmount) ? 'positive-text' : 'negative-text'
            "
            >{{ previousMonthComparison }}</el-text
          >
          <el-text tag="span"> ( </el-text>
          <el-text
            tag="span"
            v-bind:class="
              isPositive(currentMonthAmount - prevMonthAmount) ? 'positive-text' : 'negative-text'
            "
            >{{ previousMonthRatio }}%</el-text
          >
          <el-text tag="span"> ) </el-text>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">
          <el-text tag="span" size="small" class="black-text">前年比</el-text>
        </el-col>
        <el-col :span="18">
          <el-text
            tag="span"
            size="large"
            v-bind:class="
              isPositive(currentMonthAmount - prevYearAmount) ? 'positive-text' : 'negative-text'
            "
            >{{ previousYearComparison }}</el-text
          >
          <el-text tag="span"> ( </el-text>
          <el-text
            tag="span"
            v-bind:class="
              isPositive(currentMonthAmount - prevYearAmount) ? 'positive-text' : 'negative-text'
            "
            >{{ previousYearRatio }}%</el-text
          >
          <el-text tag="span"> ) </el-text>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="16"><StackedColumnsChart :series="lineSeries" /></el-col>
  </el-row>
</template>

<style scoped>
* {
  color: #fefefe;
}
.container {
  background-color: #30343d;
  padding: 30px 40px;
  border-radius: 4px;
}

.margin-top {
  margin-top: 50px;
}
.emphasis {
  font-size: 40px;
  color: #c7a780;
  /* text-size */
}

.black-text {
  color: #9496a0;
}

.positive-text {
  color: #6fd4c3;
}

.negative-text {
  color: #c7a780;
}

/* mainColor:#C7A780 */
/* 6fd4c3 */
</style>
