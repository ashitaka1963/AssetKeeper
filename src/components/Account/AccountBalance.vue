<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, computed } from 'vue';
import { useBalancesStore } from '@/stores/balances';
import BasicLineChart from '../Charts/BasicLineChart.vue';
import { addPlusSign, calculateIncreaseRatio, isPositive, findSameDate } from '@/utils/commonUtils';

const balancesStore = useBalancesStore();

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
const balances = computed((): any => {
  return balancesStore.balances;
});

const lineSeries = computed((): any => {
  const monthlyData: any = [];
  for (let month = 1; month <= 12; month++) {
    const monthString = month.toString().padStart(2, '0');
    const date = dayjs(`${selectYear.value}-${monthString}-01`);
    monthlyData.push({
      x: date.format('YYYY/MM'),
      y: null
    });
  }

  // トランザクションデータを月ごとにマッピング
  balances.value.forEach((balance: any) => {
    const balanceYear = dayjs(balance.balance_date).year();
    if (balanceYear == selectYear.value) {
      const monthIndex = dayjs(balance.balance_date).month();
      monthlyData[monthIndex].y = balance.amount;
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

// 最新残高履歴
const getLatestBalance = computed((): number => {
  if (balances.value.length != 0) {
    return balances.value[0].amount.toLocaleString();
  } else {
    return 0;
  }
});

// 今月残高
const currentMonthAmount = computed((): number => {
  const today = dayjs();
  const balanceHistory = balances.value;
  const currentMonthAmount = findSameDate(balanceHistory, today, 'month');

  return currentMonthAmount;
});

// 前月残高
const prevMonthAmount = computed((): number => {
  const prevMonth = dayjs().subtract(1, 'month');
  const balanceHistory = balances.value;
  const prevMonthAmount = findSameDate(balanceHistory, prevMonth, 'month');

  return prevMonthAmount;
});

// 前年同月残高
const prevYearAmount = computed((): number => {
  const prevYear = dayjs().subtract(1, 'year');
  const balanceHistory = balances.value;
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
</script>

<template>
  <el-row class="container">
    <el-col :span="6">
      <el-row>
        <el-col :span="24">
          <el-text tag="p" size="large">資産</el-text>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-text tag="p" size="large">
            ￥
            <el-text tag="span" class="large-text text-primary">{{ getLatestBalance }}</el-text>
          </el-text>
        </el-col>
      </el-row>
      <el-row class="margin-top"><el-text tag="p" size="large">比率</el-text> </el-row>
      <el-row>
        <el-col>
          <el-text tag="p" size="small" class="text-muted"
            >※{{ dayjs().format('YYYY/MM') }}時点</el-text
          >
        </el-col>
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
    <el-col :span="16"><BasicLineChart :series="lineSeries" /></el-col>
    <el-col :span="2">
      <el-select
        v-model="selectYear"
        placeholder="Select"
        size="small"
        style="width: 70px"
        effect="dark"
        class="assetkeeper-select"
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
