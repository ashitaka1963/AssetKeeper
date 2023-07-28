<script setup lang="ts">
import { computed } from 'vue';
import { useAccountsStore } from '@/stores/accounts';
import { Search } from '@element-plus/icons-vue';
const accountsStore = useAccountsStore();

const colors = ['#c7a780', '#6fd4c3']; // TODO:配色検討
let prevName = '';
let prevColorIndex = 0;

// ========================================
// Computed
// ========================================
const accounts = computed((): any => {
  return accountsStore.accounts;
});

// ========================================
// Methods
// ========================================
// TODO:名前によるソートが事前に必要
// TODO:indexに-1が入る
// TODO:ユーザ情報としてカラー情報を持たせるか？
function getColor(name: string, index: number): string {
  // if (index < 0) return;

  if (name === prevName) {
    // 前のアイテムとnameが同じ場合は前の色を再利用
    return colors[prevColorIndex];
  } else if (index === 0) {
    prevName = name;
    return colors[prevColorIndex];
  } else {
    // 前のアイテムとnameが異なる場合は次の色を使用し、prevNameとprevColorIndexを更新
    prevName = name;
    prevColorIndex = (prevColorIndex + 1) % colors.length;
    console.log(prevColorIndex);
    return colors[prevColorIndex];
  }
}
</script>

<template>
  <el-row class="container">
    <el-col :span="24">
      <el-table :data="accounts" style="width: 100%">
        <!-- <el-table-column prop="date" label="Date" width="180" /> -->
        <el-table-column prop="user" label="User" width="80">
          <template #default="scope">
            <el-avatar :style="{ backgroundColor: getColor(scope.row.user, scope.$index) }">
              {{ scope.row.user[0].toUpperCase() }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" width="380" />

        <el-table-column prop="type" label="Type">
          <template #default="scope">
            <el-tag class="ml-2" type="info" effect="dark">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="Balance" width="180" />
        <el-table-column width="120">
          <template #default>
            <!-- <el-button link type="primary" size="small" @click="handleClick">Detail</el-button> -->
            <el-button type="info" :icon="Search" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  {{ accounts }}
</template>

<style scoped>
* {
  color: #fefefe;
}

.container {
  background-color: #30343d;
  padding: 30px 40px;
  border-radius: 4px;
  margin-bottom: 30px;
}

.background-color-black {
  background-color: #30343d;
}
</style>
