<script setup lang="ts">
// import { ref, computed } from 'vue';
import DonutChart from '../Charts/DonutChart.vue';
</script>

<template>
  <!-- <el-row class="container">
    <el-col :span="24"> <el-text tag="p" size="large">ユーザ別</el-text></el-col>
    <el-col :span="8" class="margin-top"> ashitaka1<Donut /></el-col>
    <el-col :span="8"> ashitaka2<Donut /></el-col>
  </el-row> -->
  <el-row class="container">
    <el-col :span="24">
      <el-row>
        <el-col :span="24"> <el-text tag="p" size="large">ユーザ別</el-text></el-col>
      </el-row>
      <el-row class="margin-top">
        <el-col :span="12"> ashitaka1<DonutChart /></el-col>
        <el-col :span="12"> ashitaka2<DonutChart /></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
* {
  color: #fefefe;
}
.container {
  margin-top: 20px;
  background-color: #30343d;
  padding: 40px 40px;
  border-radius: 4px;
}

.margin-top {
  margin-top: 30px;
}
</style>
