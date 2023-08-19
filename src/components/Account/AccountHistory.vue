<script setup lang="ts">
// TODO:バリデーション（重複登録チェック、数値）
import dayjs from 'dayjs';
import { ref, reactive, computed, watch } from 'vue';

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

const isDialogVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const deleteBalanceId = ref('');
const deleteBalanceDate = ref('');

const isEdit = ref(true);

interface Balance {
  _id: string | null;
  accountId: string;
  balanceDate: string;
  balanceAmount: string;
  memo: string;
}

const form = reactive<Balance>({
  _id: null,
  accountId: props.accountId,
  balanceDate: dayjs().format('YYYY/MM'),
  balanceAmount: '',
  memo: ''
});

const defaultForm: Balance = {
  _id: null,
  accountId: props.accountId,
  balanceDate: dayjs().format('YYYY/MM'),
  balanceAmount: '',
  memo: ''
};

const validateBalanceDate = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('日付を選択してください。'));
  }

  const foundData = balances.value.find((item: any) => {
    const balanceDate = dayjs(item.balanceDate);
    return balanceDate.isSame(dayjs(value), 'month');
  });

  if (foundData) {
    callback(new Error('登録日付が重複しています。'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<Balance>>({
  balanceDate: [{ validator: validateBalanceDate, trigger: 'blur' }],
  balanceAmount: [
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
    const currentAmount = currentMonthData.balanceAmount;
    const prevAmount = balancesStore.balances[i + 1].balanceAmount;

    const diff = currentAmount - prevAmount;
    result.push({
      ...currentMonthData,
      diff,
      diffColor: diff > 0 ? 'text-accent' : 'text-primary'
    });
  }

  const lastMonthData = balancesStore.balances[balancesStore.balances.length - 1];
  result.push({ ...lastMonthData, diff: lastMonthData.balanceAmount, diffColor: 'text-accent' });

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
  Object.assign(form, balancesStore.getById(balanceId));
}

async function deleteBalance(balanceId: string) {
  loadingUtils.startLoading();

  await balancesStore.deleteBalance(balanceId);

  loadingUtils.closeLoading();
}

async function saveBalance() {
  loadingUtils.startLoading();

  if (isEdit.value) {
    await balancesStore.editBalance({ ...form });
  } else {
    await balancesStore.addBalance({ ...form });
  }

  isDialogVisible.value = false;
  loadingUtils.closeLoading();
}

async function submitForm() {
  const formEl = ruleFormRef.value;
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      saveBalance();
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
          <el-table-column prop="balanceDate" label="対象月" width="180">
            <template #default="scope"
              >{{ scope.row.balanceDate ? dayjs(scope.row.balanceDate).format('YYYY/MM') : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="balanceAmount" label="残高">
            <template #default="scope">￥ {{ scope.row.balanceAmount.toLocaleString() }} </template>
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
                @click="editDialogOpen(scope.row._id)"
                :icon="Edit"
                circle
              ></el-button>
              <el-button
                class="sub-icon-button"
                color="#30343d"
                @click="
                  isConfirmDialogVisible = true;
                  deleteBalanceId = scope.row._id;
                  deleteBalanceDate = dayjs(scope.row.balanceDate).format('YYYY/MM');
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
      <el-form-item label="日付" prop="balanceDate">
        <el-date-picker
          v-model="form.balanceDate"
          type="month"
          placeholder="Pick a date"
          style="width: 100%"
          format="YYYY/MM"
          value-format="YYYY-MM"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="残高" prop="balanceAmount">
        <el-input
          v-model.number="form.balanceAmount"
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
