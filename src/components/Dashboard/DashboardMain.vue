<script setup lang="ts"></script>

<template>
  <el-row class="container">
    <el-col :span="8">
      <div>
        <p>総資産</p>
        <p>￥999,999</p>
      </div>
      <div>
        <p>比率</p>
        <p>前月比 +1000(+10.0%)</p>
        <p>前年比 +10000(+16.0%)</p>
      </div>
    </el-col>
    <el-col :span="16">TDOO:積み上げグラフ</el-col>
  </el-row>
</template>

<style scoped>
.container {
  background-color: #30343d;
  padding: 30px 40px;
  border-radius: 4px;
}
</style>
