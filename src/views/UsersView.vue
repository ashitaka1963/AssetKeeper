<script setup lang="ts">
// TODO:メッセージ表示
// TODO:バリデーション（重複登録チェック、数値）
// TODO:【table】no-data見栄え

import { ref, reactive, computed, watch } from 'vue';
import PageHeader from '../components/PageHeader.vue';

import { useUsersStore } from '@/stores/users';
import { Delete, Edit } from '@element-plus/icons-vue';

const usersStore = useUsersStore();
const isTop = ref(true);
const isDialogVisible = ref(false);
const isEdit = ref(true);
let form: any = reactive({
  id: null,
  name: '',
  email: '',
  color: '#409EFF'
});

let defaultForm: any = {
  id: null,
  name: '',
  email: '',
  color: '#409EFF'
};

init();

// ========================================
// Computed
// ========================================

const dialogTitle = computed((): any => {
  return isEdit.value ? 'Edit' : 'New';
});

const dialogButtonName = computed((): any => {
  return isEdit.value ? 'Update' : 'Create';
});

// ========================================
// Methods
// ========================================
async function init() {
  await getUsers();
}

function getUsers() {
  usersStore.fetchUsers();
}

function editClick(id: number) {
  console.log(form);
  isDialogVisible.value = !isDialogVisible.value;
  isEdit.value = true;

  Object.assign(form, usersStore.getById(id));
}

function deleteClick(id: number) {
  usersStore.deleteUser(id);
}

function onSubmit() {
  if (isEdit.value) {
    usersStore.editUser({ ...form });
  } else {
    usersStore.addUser({ ...form });
  }
  isDialogVisible.value = !isDialogVisible.value;
}

// ========================================
// Watch
// ========================================
watch(isDialogVisible, (value) => {
  !value ? Object.assign(form, defaultForm) : '';
});
</script>

<template>
  <main>
    <PageHeader headerName="Users" :isTop="isTop" />
    <div class="container">
      <el-row>
        <el-col :span="24">
          <el-table :data="usersStore.users" style="width: 100%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="email" label="E-mail" />

            <el-table-column prop="color" label="Color">
              <template #default="scope">
                <el-color-picker v-model="scope.row.color" />
                <span class="margin-left">{{ scope.row.color }}</span>
              </template>
            </el-table-column>
            <el-table-column width="120">
              <template #header>
                <el-button
                  color="#c7a780"
                  @click="
                    isDialogVisible = true;
                    isEdit = false;
                  "
                  >Add Item</el-button
                >
              </template>
              <template #default="scope">
                <el-button
                  class="main-icon-button"
                  color="#30343d"
                  @click="editClick(scope.row.id)"
                  :icon="Edit"
                  circle
                ></el-button>
                <el-button
                  class="sub-icon-button"
                  color="#30343d"
                  @click="deleteClick(scope.row.id)"
                  :icon="Delete"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!-- dialog -->
    <el-dialog
      v-model="isDialogVisible"
      :title="dialogTitle"
      width="30%"
      align-center
      class="dialog"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item v-if="isEdit" label="Id">
          {{ form.id }}
        </el-form-item>
        <el-form-item label="名前">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="E-mail">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="Color">
          <el-color-picker v-model="form.color" />
          <span class="margin-left">{{ form.color }}</span>
        </el-form-item>

        <el-form-item>
          <el-button color="#c7a780" @click="onSubmit">{{ dialogButtonName }}</el-button>
          <el-button type="info" @click="isDialogVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    {{ usersStore.users }}
  </main>
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
  margin-bottom: 30px;
}

.dialog {
  background-color: #30343d;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.main-icon-button {
  border-color: #c7a780;
  color: #c0b09d;
}

.sub-icon-button {
  border-color: #6fd4c3;
  color: #6fd4c3;
}

.margin-left {
  margin-left: 8px;
}
</style>
