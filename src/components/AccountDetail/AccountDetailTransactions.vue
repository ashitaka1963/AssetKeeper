<script setup lang="ts">
// TODO:メッセージ表示
// TODO:残高履歴の降順ソート
// TODO:前月差分計算
// TODO:ボタンカラー
// TODO:重複登録チェック
// TODO:【table】no-data見栄え

import { ref, reactive, computed, watch } from 'vue';

import { useAccountsStore } from '@/stores/accounts';
import { Delete, Edit } from '@element-plus/icons-vue';

interface Props {
  accountId: number;
}

const props = defineProps<Props>();

const accountsStore = useAccountsStore();

const isDialogVisible = ref(false);
const isEdit = ref(true);
let form: any = reactive({
  month: '',
  balance: '',
  memo: ''
});

// ========================================
// Computed
// ========================================
// const accountId = 1; //TODO:要修正
const account = computed((): any => {
  return accountsStore.getById(props.accountId);
});

// ========================================
// Methods
// ========================================
function editClick(index: number) {
  isDialogVisible.value = !isDialogVisible.value;
  isEdit.value = true;
  Object.assign(form, account.value.balance_history[index]);
}

function deleteClick(index: number) {
  accountsStore.deleteBalanceHistory(props.accountId, account.value.balance_history[index]);
}

function onSubmit() {
  if (isEdit.value) {
    accountsStore.editBalanceHistory(props.accountId, { ...form });
  } else {
    accountsStore.addBalanceHistory(props.accountId, { ...form });
  }
  isDialogVisible.value = !isDialogVisible.value;
}

// ========================================
// Watch
// ========================================
watch(isDialogVisible, (value) => {
  !value ? Object.keys(form).forEach((key) => (form[key] = '')) : '';
});
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-text tag="p" size="large">History</el-text>
      </el-col>
    </el-row>
    <el-row>
      <!-- <el-text tag="p" size="large">総資産</el-text> -->
      <el-col :span="24">
        <el-table :data="account.balance_history" style="width: 100%">
          <!-- <el-table-column prop="date" label="Date" width="180" /> -->
          <!-- <el-table-column prop="user" label="User" width="80">
            <template #default="scope">
              <el-avatar :style="{ backgroundColor: getColor(scope.row.user, scope.$index) }">
                {{ scope.row.user[0].toUpperCase() }}
              </el-avatar>
            </template>
          </el-table-column> -->
          <el-table-column prop="month" label="対象月" width="180" />
          <el-table-column prop="balance" label="残高" />
          <el-table-column label="前月差分">999</el-table-column>
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
                @click="editClick(scope.$index)"
                type="info"
                :icon="Edit"
                circle
              ></el-button>
              <el-button
                @click="deleteClick(scope.$index)"
                type="info"
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
  <el-dialog v-model="isDialogVisible" title="New" width="30%" align-center class="dialog">
    <el-form :model="form" label-width="80px">
      <el-form-item label="日付">
        <el-date-picker
          v-model="form.month"
          type="month"
          placeholder="Pick a date"
          style="width: 100%"
          format="YYYY/MM"
          value-format="YYYY-MM"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="残高">
        <el-input
          v-model="form.balance"
          :formatter="(value: string) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value.replace(/\¥\s?|(,*)/g, '')"
        />
      </el-form-item>

      <el-form-item label="メモ">
        <el-input v-model="form.memo" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button color="#c7a780" @click="onSubmit">Create</el-button>
        <el-button type="info" @click="isDialogVisible = false">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- {{ account.balance_history }} -->
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
</style>
