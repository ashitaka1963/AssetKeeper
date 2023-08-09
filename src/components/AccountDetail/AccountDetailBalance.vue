<script setup lang="ts">
import dayjs from 'dayjs';
import { computed } from 'vue';
import { useAccountsStore } from '@/stores/accounts';
import BasicLineChart from '../Charts/BasicLineChart.vue';

interface Props {
  accountId: string;
}

const props = defineProps<Props>();
const accountsStore = useAccountsStore();

// ========================================
// Computed
// ========================================
const account = computed((): any => {
  return accountsStore.getById(props.accountId);
});

const lineSeries = computed((): any => {
  const year = 2023; //TODO:2023年固定
  const monthlyData: any = [];
  for (let month = 1; month <= 12; month++) {
    const monthString = month.toString().padStart(2, '0');
    const date = dayjs(`${year}-${monthString}-01`);
    monthlyData.push({
      x: date.format('YYYY/MM'),
      y: null
    });
  }

  // トランザクションデータを月ごとにマッピング
  account.value.balances.history.forEach((balance: any) => {
    const balanceYear = dayjs(balance.balanceDate).year();
    if (balanceYear == year) {
      const monthIndex = dayjs(balance.balanceDate).month();
      monthlyData[monthIndex].y = balance.balanceAmount;
    }
  });

  const series: any = [
    {
      name: '',
      data: monthlyData
    }
  ];

  return series;
});

// TODO:latestBalance使用検討
const formattedNumber = computed((): string => {
  const latestBalance =
    account.value.balances.history.length != 0
      ? account.value.balances.history[0].balanceAmount
      : 0;
  return latestBalance.toLocaleString();
});

const currentMonthAmount = computed((): number => {
  // 今月残高
  const today = dayjs();
  const balanceHistory = account.value.balances.history;
  const currentMonthAmount = findSameDate(balanceHistory, today, 'month');

  return currentMonthAmount;
});

const prevMonthAmount = computed((): number => {
  // 前月残高
  const prevMonth = dayjs().subtract(1, 'month');
  const balanceHistory = account.value.balances.history;
  const prevMonthAmount = findSameDate(balanceHistory, prevMonth, 'month');

  return prevMonthAmount;
});

const prevYearAmount = computed((): number => {
  // 前年同月残高
  const prevYear = dayjs().subtract(1, 'year');
  const balanceHistory = account.value.balances.history;
  const prevYearAmount = findSameDate(balanceHistory, prevYear, 'month');

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
          <el-text tag="p" size="large">資産</el-text>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-text tag="p" size="large">
            ￥ <el-text tag="span" class="emphasis">{{ formattedNumber }}</el-text>
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
    <el-col :span="16"><BasicLineChart :series="lineSeries" /></el-col>
  </el-row>
</template>

<style scoped>
* {
  color: #fefefe;
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
