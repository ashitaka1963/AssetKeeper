<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOwnersStore } from '@/stores/owners';
import { useAccountsStore } from '@/stores/accounts';
import { Search, Delete, Edit } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import ConfirmDialog from '../parts/ConfirmDialog.vue';

import loadingUtils from '../../CustomLoading';

const router = useRouter();
const accountsStore = useAccountsStore();
const ownersStore = useOwnersStore();
const ruleFormRef = ref<FormInstance>();

const isDialogVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const deleteAccountId = ref('');
const deleteAccountName = ref('');
const isEdit = ref(true);

interface Account {
  id: string | null;
  accountName: string;
  accountType: string;
  ownerId: string;
}

const form = reactive<Account>({
  id: null,
  accountName: '',
  accountType: '',
  ownerId: ''
});

const defaultForm: Account = {
  id: null,
  accountName: '',
  accountType: '',
  ownerId: ''
};

const typeOptions = [
  {
    value: 'Bank',
    label: 'Bank'
  },
  {
    value: 'Brokerage',
    label: 'Brokerage'
  }
];

const rules = reactive<FormRules<Account>>({
  accountName: [
    { required: true, message: 'アカウント名を入力してください。', trigger: 'blur' },
    { min: 1, max: 15, message: '15文字以内で入力してください。', trigger: 'blur' }
  ],
  accountType: [
    {
      required: true,
      message: 'タイプを選択してください。',
      trigger: 'change'
    }
  ],
  ownerId: [
    {
      required: true,
      message: 'オーナーを選択してください。',
      trigger: 'change'
    }
  ]
});

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

const owners = computed((): any => {
  return ownersStore.owners;
});

// ========================================
// Methods
// ========================================

function goToAccountView(accountId: string) {
  router.push({ name: 'AccountView', params: { id: accountId } });
}

function editDialogOpen(accountId: string) {
  isDialogVisible.value = true;
  isEdit.value = true;

  console.log(accountsStore.getById(accountId));

  Object.assign(form, accountsStore.getById(accountId));
}

async function deleteAccount(accountId: string) {
  loadingUtils.startLoading();

  await accountsStore.deleteAccount(accountId);

  loadingUtils.closeLoading();
}

async function saveAccount() {
  loadingUtils.startLoading();

  if (isEdit.value) {
    await accountsStore.editAccount({ ...form });
  } else {
    await accountsStore.addAccount({ ...form });
  }

  isDialogVisible.value = false;
  loadingUtils.closeLoading();
}

function getInitialOwnerName(ownerId: string): string {
  const foundOwner = owners.value.find((owner: any) => owner.id === ownerId);

  return foundOwner ? foundOwner.name[0].toUpperCase() : null;
}

function getOwnerColor(ownerId: string): string {
  const foundOwner = owners.value.find((owner: any) => owner.id === ownerId);

  return foundOwner ? foundOwner.color : '';
}

async function submitForm() {
  const formEl = ruleFormRef.value;
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      saveAccount();
    } else {
      console.log('error submit!', fields);
    }
  });
}

function cancelForm() {
  const formEl = ruleFormRef.value;
  if (!formEl) return;

  formEl.resetFields();

  Object.assign(form, defaultForm);
  isDialogVisible.value = false;
}

function onConfirmButtonClick() {
  deleteAccount(deleteAccountId.value);
  onCancelButtonClick();
}

function onCancelButtonClick() {
  isConfirmDialogVisible.value = false;
  deleteAccountName.value = '';
  deleteAccountId.value = '';
}
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
              <el-avatar :style="{ backgroundColor: getOwnerColor(scope.row.ownerId) }">
                {{ getInitialOwnerName(scope.row.ownerId) }}
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
                @click="goToAccountView(scope.row.id)"
                :icon="Search"
                circle
              ></el-button>
              <el-button
                class="main-icon-button"
                color="#30343d"
                @click="editDialogOpen(scope.row.id)"
                :icon="Edit"
                circle
              ></el-button>
              <el-button
                class="sub-icon-button"
                color="#30343d"
                @click="
                  isConfirmDialogVisible = true;
                  deleteAccountId = scope.row.id;
                  deleteAccountName = scope.row.accountName;
                "
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
      :before-close="cancelForm"
    >
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.accountName" />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="form.accountType" placeholder="Select">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Owner" prop="ownerId">
          <el-select v-model="form.ownerId" placeholder="Select">
            <el-option v-for="item in owners" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button color="#c7a780" @click="submitForm">{{ dialogButtonName }}</el-button>
          <el-button type="info" @click="cancelForm">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <ConfirmDialog
      :isDialogVisible="isConfirmDialogVisible"
      :message="`アカウント(${deleteAccountName})を削除しますか？`"
      @clickConfirmed="onConfirmButtonClick"
      @clickCanceled="onCancelButtonClick"
    />
  </div>
</template>

<style scoped>
* {
  color: #fefefe;
}
</style>
