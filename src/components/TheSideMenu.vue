<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Menu as IconMenu, Setting, User } from '@element-plus/icons-vue';

const router = useRouter();

const routeMap = new Map([
  ['1', 'DashboardView'],
  ['2', 'UsersView']
]);

const menuClick = (key: string) => {
  router.push({ name: routeMap.get(key) });
};
</script>

<template>
  <el-menu default-active="1" collapse="false" @select="menuClick" background-color="#1F222A">
    <el-menu-item index="1">
      <el-icon :size="50"><icon-menu /></el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon :size="50"><user /></el-icon>
      <template #title>User</template>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon :size="50"><setting /></el-icon>
      <template #title>Setting</template>
    </el-menu-item>
  </el-menu>
</template>

<style>
.el-menu {
  border-right: none;
  margin: 0 auto;
}

.el-menu-item i {
  color: #3e4451;
}

.el-menu-item.is-active {
  color: #c7a780;
  background-color: #30343d;
}
</style>
