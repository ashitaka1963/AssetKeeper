<script setup lang="ts">
// TODO:メッセージ表示
// TODO:前月差分計算
// TODO:バリデーション（重複登録チェック、数値）
import dayjs from 'dayjs';
import { ref, reactive, computed, watch } from 'vue';

import { useBalancesStore } from '@/stores/balances';
import { Delete, Edit } from '@element-plus/icons-vue';

interface Props {
  accountId: string;
}

const props = defineProps<Props>();

const balancesStore = useBalancesStore();

const isDialogVisible = ref(false);
const isEdit = ref(true);
let form: any = reactive({
  _id: null,
  accountId: props.accountId,
  balanceDate: '',
  balanceAmount: '',
  memo: ''
});

let defaultForm: any = {
  _id: null,
  accountId: props.accountId,
  balanceDate: '',
  balanceAmount: '',
  memo: ''
};

// ========================================
// Computed
// ========================================
const balances = computed((): any => {
  return balancesStore.balances;
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
  isDialogVisible.value = !isDialogVisible.value;
  isEdit.value = true;
  Object.assign(form, balancesStore.getById(balanceId));
}

function deleteBalance(balanceId: string) {
  balancesStore.deleteBalance(balanceId);
}

function saveBalance() {
  if (isEdit.value) {
    balancesStore.editBalance({ ...form });
  } else {
    balancesStore.addBalance({ ...form });
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
              >{{ scope.row.balanceDate ? dayjs(scope.row.balanceDate).format('YYYY/MM/DD') : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="balanceAmount" label="残高">
            <template #default="scope">￥ {{ scope.row.balanceAmount.toLocaleString() }} </template>
          </el-table-column>
          <el-table-column label="前月差分">￥ 999</el-table-column>
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
                @click="deleteBalance(scope.row._id)"
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
  <el-dialog v-model="isDialogVisible" :title="dialogTitle" width="30%" align-center class="dialog">
    <el-form :model="form" label-width="80px">
      <el-form-item label="日付">
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
      <el-form-item label="残高">
        <el-input
          v-model="form.balanceAmount"
          :formatter="(value: string) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value.replace(/\¥\s?|(,*)/g, '')"
        />
      </el-form-item>

      <el-form-item label="メモ">
        <el-input v-model="form.memo" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button color="#c7a780" @click="saveBalance">{{ dialogButtonName }}</el-button>
        <el-button type="info" @click="isDialogVisible = false">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
* {
  color: #fefefe;
}
</style>
