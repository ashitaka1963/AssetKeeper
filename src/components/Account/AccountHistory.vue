<script setup lang="ts">
// TODO:バリデーション（重複登録チェック、数値）
import dayjs from 'dayjs';
import { ref, reactive, computed, watch } from 'vue';

import { useAccountsStore } from '@/stores/accounts';
import { useBalancesStore } from '@/stores/balances';
import { Delete, Edit } from '@element-plus/icons-vue';

import ConfirmDialog from '../parts/ConfirmDialog.vue';

import { addPlusSign, findSameDate } from '@/utils/commonUtils';

import loadingUtils from '../../CustomLoading';
import type { FormInstance, FormRules } from 'element-plus';

interface Props {
  accountId: string;
}

const props = defineProps<Props>();
const ruleFormRef = ref<FormInstance>();

const balancesStore = useBalancesStore();
const accountsStore = useAccountsStore();

const isDialogVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const deleteBalanceId = ref('');
const deleteBalanceDate = ref('');

const isEdit = ref(true);

interface Balance {
  id: string | null;
  account_id: string;
  balance_date: string;
  amount: string;
  memo: string;
}

const form = reactive<Balance>({
  id: null,
  account_id: props.accountId,
  balance_date: dayjs().format('YYYY/MM'),
  amount: '',
  memo: ''
});

const defaultForm: Balance = {
  id: null,
  account_id: props.accountId,
  balance_date: dayjs().format('YYYY/MM'),
  amount: '',
  memo: ''
};

const validateBalanceDate = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('日付を選択してください。'));
  }

  if (isEdit.value) callback();

  const foundData = balances.value.find((item: any) => {
    const balanceDate = dayjs(item.balance_date);
    return balanceDate.isSame(dayjs(value), 'month');
  });

  if (foundData) {
    callback(new Error('登録日付が重複しています。'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<Balance>>({
  balance_date: [{ validator: validateBalanceDate, trigger: 'blur' }],
  amount: [
    {
      required: true,
      message: '残高を入力してください。',
      trigger: 'blur'
    },
    {
      type: 'number',
      message: '数値を入力してください。',
      trigger: 'blur'
    }
  ]
});

// ========================================
// Computed
// ========================================
const balances = computed((): any => {
  const result: any = [];
  if (balancesStore.balances.length == 0) return result;

  // 差分計算
  for (let i = 0; i < balancesStore.balances.length - 1; i++) {
    const currentMonthData = balancesStore.balances[i];
    const currentAmount = currentMonthData.amount;
    const prevAmount = balancesStore.balances[i + 1].amount;

    const diff = currentAmount - prevAmount;
    result.push({
      ...currentMonthData,
      diff,
      diffColor: diff > 0 ? 'text-accent' : 'text-primary'
    });
  }

  const lastMonthData = balancesStore.balances[balancesStore.balances.length - 1];
  result.push({ ...lastMonthData, diff: lastMonthData.amount, diffColor: 'text-accent' });

  return result;
});

const dialogTitle = computed((): any => {
  return isEdit.value ? 'Edit' : 'New';
});

const dialogButtonName = computed((): any => {
  return isEdit.value ? 'Update' : 'Create';
});

// ========================================
// Methods
// ========================================
function editDialogOpen(balanceId: string) {
  isDialogVisible.value = true;
  isEdit.value = true;

  const balance = balancesStore.getById(balanceId);
  Object.assign(form, balance);
}

async function deleteBalance(balanceId: string) {
  loadingUtils.startLoading();

  const returnedBalance = await balancesStore.deleteBalance(balanceId);

  if (returnedBalance) {
    // 最新残高および日付を更新
    await accountsStore.editAccount({
      id: returnedBalance.account_id,
      latest_balance: returnedBalance.amount,
      latest_date: returnedBalance.balance_date
    });
  }

  loadingUtils.closeLoading();
}

async function saveBalance() {
  let returnedBalance = null;
  if (isEdit.value) {
    returnedBalance = await balancesStore.editBalance({ ...form });
  } else {
    returnedBalance = await balancesStore.addBalance({ ...form });
  }

  if (!returnedBalance) return;

  if (returnedBalance.balance_date == balances.value[0].balance_date) {
    // 最新残高および日付を更新
    await accountsStore.editAccount({
      id: returnedBalance.account_id,
      latest_balance: returnedBalance.amount,
      latest_date: returnedBalance.balance_date
    });
  }
}

async function submitForm() {
  // バリデーションチェック
  const formEl = ruleFormRef.value;
  if (!formEl) return;

  const isFormValid = await formEl.validate((valid, fields) => {
    if (!valid) {
      console.log('error submit!', fields);
    }

    return valid;
  });

  if (isFormValid) {
    loadingUtils.startLoading();

    saveBalance();

    closeForm();
    loadingUtils.closeLoading();
  }
}

function cancelForm() {
  const formEl = ruleFormRef.value;
  if (!formEl) return;

  formEl.resetFields();

  closeForm();
}

function closeForm() {
  Object.assign(form, defaultForm);
  isDialogVisible.value = false;
}

function onConfirmButtonClick() {
  deleteBalance(deleteBalanceId.value);
  onCancelButtonClick();
}

function onCancelButtonClick() {
  isConfirmDialogVisible.value = false;
  deleteBalanceDate.value = '';
  deleteBalanceId.value = '';
}
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-text tag="p" size="large">History</el-text>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="balances" style="width: 100%">
          <el-table-column prop="balance_date" label="対象月" width="180">
            <template #default="scope"
              >{{ scope.row.balance_date ? dayjs(scope.row.balance_date).format('YYYY/MM') : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="残高">
            <template #default="scope">￥ {{ scope.row.amount.toLocaleString() }} </template>
          </el-table-column>
          <el-table-column label="差分">
            <template #default="scope">
              <el-text tag="span" size="large" v-bind:class="scope.row.diffColor">{{
                addPlusSign(scope.row.diff)
              }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="memo" label="メモ" />
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
                @click="editDialogOpen(scope.row.id)"
                :icon="Edit"
                circle
              ></el-button>
              <el-button
                class="sub-icon-button"
                color="#30343d"
                @click="
                  isConfirmDialogVisible = true;
                  deleteBalanceId = scope.row.id;
                  deleteBalanceDate = dayjs(scope.row.balance_date).format('YYYY/MM');
                "
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
    :before-close="cancelForm"
  >
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px" status-icon>
      <el-form-item label="日付" prop="balance_date">
        <el-date-picker
          v-model="form.balance_date"
          type="month"
          placeholder="Pick a date"
          style="width: 100%"
          format="YYYY/MM"
          value-format="YYYY-MM"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="残高" prop="amount">
        <el-input
          v-model.number="form.amount"
          :formatter="(value: string) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value.replace(/\¥\s?|(,*)/g, '')"
        />
      </el-form-item>

      <el-form-item label="メモ" prop="memo">
        <el-input v-model="form.memo" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button color="#c7a780" @click="submitForm">{{ dialogButtonName }}</el-button>
        <el-button type="info" @click="cancelForm">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <ConfirmDialog
    :isDialogVisible="isConfirmDialogVisible"
    :message="`残高履歴(${deleteBalanceDate})を削除しますか？`"
    @clickConfirmed="onConfirmButtonClick"
    @clickCanceled="onCancelButtonClick"
  />
</template>

<style scoped>
* {
  color: #fefefe;
}
</style>
