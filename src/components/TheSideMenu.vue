<script setup lang="ts">
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

import { Menu as IconMenu, User, SwitchButton } from '@element-plus/icons-vue';

const router = useRouter();

const routeMap = new Map([
  ['1', 'DashboardView'],
  ['2', 'OwnersView']
]);

const menuClick = (key: string) => {
  router.push({ name: routeMap.get(key) });
};

const signOut = () => {
  supabase.auth.signOut();
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
      <template #title>Owner</template>
    </el-menu-item>
    <div class="fixed-bottom">
      <el-divider style="border-color: #7c808e"> </el-divider>
      <el-menu-item index="4" @click="signOut">
        <el-icon :size="50"><SwitchButton /></el-icon>
        <template #title>Logout</template>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<style>
.el-menu {
  border-right: none;
  margin: 0 auto;
  height: 100%;
}

.el-menu-item i {
  color: #3e4451;
}

.el-menu-item.is-active {
  color: #c7a780;
  background-color: #30343d;
}

.fixed-bottom {
  position: absolute;
  bottom: 10px;
  width: 100%;
}
</style>
