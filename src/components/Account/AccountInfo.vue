<script setup lang="ts">
import { computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useAccountsStore } from '@/stores/accounts';

interface Props {
  accountId: string;
}

const props = defineProps<Props>();
const usersStore = useUsersStore();
const accountsStore = useAccountsStore();

// ========================================
// Computed
// ========================================

const account = computed((): any => {
  return accountsStore.getById(props.accountId);
});

const userName = computed((): any => {
  return usersStore.getById(account.value.ownerId).userName;
});
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="8">
        <el-text tag="p" class="text-muted">Name</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p" class="text-muted">Type</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p" class="text-muted">Owner</el-text>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-text tag="p">{{ account.accountName }}</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p">{{ account.accountType }}</el-text>
      </el-col>
      <el-col :span="8">
        <el-text tag="p">{{ userName }}</el-text>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
* {
  color: #fefefe;
}
</style>
