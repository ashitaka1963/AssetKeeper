<script setup lang="ts">
import { ref, computed } from 'vue';
import BasicLineChart from '../Charts/BasicLineChart.vue';

interface Props {
  accountId: number;
}

const props = defineProps<Props>();

const currentMonthTotalAmountInit: number = 8000; // TODO:動的取得
const prevMonthTotalAmountInit: number = 5000; // TODO:動的取得
const prevYearTotalAmountInit: number = 9000; // TODO:動的取得

const currentMonthTotalAmount = ref(currentMonthTotalAmountInit);
const prevMonthTotalAmount = ref(prevMonthTotalAmountInit);
const prevYearTotalAmount = ref(prevYearTotalAmountInit);

// ========================================
// Computed
// ========================================
const formattedNumber = computed((): string => {
  return currentMonthTotalAmount.value.toLocaleString();
});

const previousMonthComparison = computed((): string => {
  return addPlusSign(currentMonthTotalAmount.value - prevMonthTotalAmount.value);
});

const previousMonthRatio = computed((): string => {
  return calculateIncreaseRatio(currentMonthTotalAmount.value, prevMonthTotalAmount.value);
});

const previousYearComparison = computed((): string => {
  return addPlusSign(currentMonthTotalAmount.value - prevYearTotalAmount.value);
});

const previousYearRatio = computed((): string => {
  return calculateIncreaseRatio(currentMonthTotalAmount.value, prevYearTotalAmount.value);
});

// ========================================
// Methods
// ========================================
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
    const ratio = (increase / previousValue) * 100;
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
              isPositive(currentMonthTotalAmount - prevMonthTotalAmount)
                ? 'positive-text'
                : 'negative-text'
            "
            >{{ previousMonthComparison }}</el-text
          >
          <el-text tag="span"> ( </el-text>
          <el-text
            tag="span"
            v-bind:class="
              isPositive(currentMonthTotalAmount - prevMonthTotalAmount)
                ? 'positive-text'
                : 'negative-text'
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
              isPositive(currentMonthTotalAmount - prevYearTotalAmountInit)
                ? 'positive-text'
                : 'negative-text'
            "
            >{{ previousYearComparison }}</el-text
          >
          <el-text tag="span"> ( </el-text>
          <el-text
            tag="span"
            v-bind:class="
              isPositive(currentMonthTotalAmount - prevYearTotalAmountInit)
                ? 'positive-text'
                : 'negative-text'
            "
            >{{ previousYearRatio }}%</el-text
          >
          <el-text tag="span"> ) </el-text>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="16"><BasicLineChart /></el-col>
  </el-row>
</template>

<style scoped>
* {
  color: #fefefe;
}
.container {
  margin-top: 20px;
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
