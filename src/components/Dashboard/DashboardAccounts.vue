<script setup lang="ts">
// TODO:アカウント削除前のダイアログ

import dayjs from 'dayjs';
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import { useAccountsStore } from '@/stores/accounts';
import { Search, Delete, Edit } from '@element-plus/icons-vue';

const router = useRouter();
const accountsStore = useAccountsStore();
const usersStore = useUsersStore();

const isDialogVisible = ref(false);
const isEdit = ref(true);

let form: any = reactive({
  _id: null,
  accountName: '',
  accountType: '',
  ownerId: ''
});

let defaultForm: any = {
  _id: null,
  accountName: '',
  accountType: '',
  ownerId: ''
};

const accountTypeOptions = [
  {
    value: 'Bank',
    label: 'Bank'
  },
  {
    value: 'Brokerage',
    label: 'Brokerage'
  }
];

// ========================================
// Computed
// ========================================

const dialogTitle = computed((): any => {
  return isEdit.value ? 'Edit' : 'New';
});

const dialogButtonName = computed((): any => {
  return isEdit.value ? 'Update' : 'Create';
});

const accounts = computed((): any => {
  return accountsStore.accounts;
});

const users = computed((): any => {
  return usersStore.users;
});

// ========================================
// Methods
// ========================================

function goToAccountView(accountId: string) {
  router.push({ name: 'AccountView', params: { id: accountId } });
}

function editDialogOpen(accountId: string) {
  isDialogVisible.value = !isDialogVisible.value;
  isEdit.value = true;

  Object.assign(form, accountsStore.getById(accountId));
}

function deleteAccount(accountId: string) {
  accountsStore.deleteAccount(accountId);
}

function saveUser() {
  if (isEdit.value) {
    accountsStore.editAccount({ ...form });
  } else {
    accountsStore.addAccount({ ...form });
  }
  isDialogVisible.value = !isDialogVisible.value;
}

function getInitialUserName(userId: string): string {
  const foundUser = users.value.find((user: any) => user._id === userId);

  return foundUser ? foundUser.userName[0].toUpperCase() : null;
}

function getUserColor(userId: string): string {
  const foundUser = users.value.find((user: any) => user._id === userId);

  return foundUser ? foundUser.color : '';
}

// ========================================
// Watch
// ========================================
watch(isDialogVisible, (value) => {
  !value ? Object.assign(form, defaultForm) : '';
});
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-text tag="p" size="large">Accounts</el-text>
      </el-col>
    </el-row>
    <!-- table -->
    <el-row>
      <el-col :span="24">
        <el-table :data="accounts" style="width: 100%">
          <el-table-column prop="ownerId" label="Owner" width="100">
            <template #default="scope">
              <el-avatar :style="{ backgroundColor: getUserColor(scope.row.ownerId) }">
                {{ getInitialUserName(scope.row.ownerId) }}
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="Name" />

          <el-table-column prop="accountType" label="Type" width="180">
            <template #default="scope">
              <el-tag class="ml-2" type="info" effect="dark">{{ scope.row.accountType }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="balances.latestBalance" label="Latest Balance" width="180">
            <template #default="scope"
              >￥ {{ scope.row.balances.latestBalance.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="balances.latestDate" label="Latest Date" width="180">
            <template #default="scope"
              >{{
                scope.row.balances.latestDate
                  ? dayjs(scope.row.balances.latestDate).format('YYYY/MM/DD')
                  : '-'
              }}
            </template>
          </el-table-column>

          <el-table-column width="150">
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
                class="normal-icon-button"
                color="#30343d"
                @click="goToAccountView(scope.row._id)"
                :icon="Search"
                circle
              ></el-button>
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
                @click="deleteAccount(scope.row._id)"
                :icon="Delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- dialog -->
    <el-dialog
      v-model="isDialogVisible"
      :title="dialogTitle"
      width="30%"
      align-center
      class="dialog"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="Name">
          <el-input v-model="form.accountName" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.accountType" placeholder="Select">
            <el-option
              v-for="item in accountTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Owner">
          <el-select v-model="form.ownerId" placeholder="Select">
            <el-option
              v-for="item in users"
              :key="item._id"
              :label="item.userName"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button color="#c7a780" @click="saveUser">{{ dialogButtonName }}</el-button>
          <el-button type="info" @click="isDialogVisible = false">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
* {
  color: #fefefe;
}
</style>
