<script setup lang="ts">
// TODO:バリデーション（重複登録チェック、数値）

import { ref, reactive, computed, watch } from 'vue';

import PageHeader from '../components/PageHeader.vue';

import { useUsersStore } from '@/stores/users';
import { Delete, Edit } from '@element-plus/icons-vue';

import loadingUtils from '../CustomLoading';

const usersStore = useUsersStore();
const isTop = ref(true);
const isDialogVisible = ref(false);
const isEdit = ref(true);

let form: any = reactive({
  _id: null,
  userName: '',
  password: '',
  email: '',
  role: 'USER',
  color: '#c7a780'
});

let defaultForm: any = {
  _id: null,
  userName: '',
  password: '',
  email: '',
  role: 'USER',
  color: '#c7a780'
};

const roleOptions = [
  {
    value: 'USER',
    label: 'USER'
  },
  {
    value: 'ADMIN',
    label: 'ADMIN'
  }
];

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
  loadingUtils.startLoading();

  await getUsers();

  loadingUtils.closeLoading();
}

function getUsers() {
  usersStore.fetchUsers();
}

function editDialogOpen(userId: string) {
  isDialogVisible.value = !isDialogVisible.value;
  isEdit.value = true;

  Object.assign(form, usersStore.getById(userId));
}

function deleteUser(userId: string) {
  usersStore.deleteUser(userId);
}

function saveUser() {
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
            <el-table-column prop="userName" label="Name" />
            <el-table-column prop="email" label="E-mail" />
            <el-table-column prop="role" label="Role" />
            <el-table-column prop="color" label="Color">
              <template #default="scope">
                <el-color-picker v-model="scope.row.color" disabled />
                <span>{{ scope.row.color }}</span>
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
                  >Add User</el-button
                >
              </template>
              <template #default="scope">
                <el-button
                  class="main-icon-button"
                  color="#30343d"
                  @click="editDialogOpen(scope.row._id)"
                  :icon="Edit"
                  circle
                ></el-button>
                <el-button
                  class="sub-icon-button"
                  color="#30343d"
                  @click="deleteUser(scope.row._id)"
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
    <el-dialog v-model="isDialogVisible" :title="dialogTitle" width="30%" align-center>
      <el-form :model="form" label-width="80px">
        <el-form-item label="Name">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="E-mail">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="form.role" placeholder="Select">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Color">
          <el-color-picker v-model="form.color" />
          <span>{{ form.color }}</span>
        </el-form-item>

        <el-form-item>
          <el-button color="#c7a780" @click="saveUser">{{ dialogButtonName }}</el-button>
          <el-button type="info" @click="isDialogVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </main>
</template>

<style scoped>
* {
  color: #fefefe;
}
.el-color-picker + span {
  margin-left: 8px;
}
</style>
