<script setup lang="ts">
import { computed } from 'vue';
import { useAccountsStore } from '@/stores/accounts';

interface Props {
  accountId: number;
}

const props = defineProps<Props>();
const accountsStore = useAccountsStore();

// ========================================
// Computed
// ========================================

const account = computed((): any => {
  return accountsStore.getById(props.accountId);
});
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="8">
        <el-text tag="p" class="black-text">Name</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p" class="black-text">Type</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p" class="black-text">User</el-text>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-text tag="p">{{ account.name }}</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p">{{ account.type }}</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p">{{ account.user }}</el-text>
      </el-col>
    </el-row>
  </div>
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

.black-text {
  color: #9496a0;
}
</style>
