<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { useAccountsStore } from '@/stores/accounts';
import { Search, Delete, Edit } from '@element-plus/icons-vue';

const router = useRouter();
const accountsStore = useAccountsStore();

const colors = ['#c7a780', '#6fd4c3']; // TODO:配色検討
let prevName = '';
let prevColorIndex = 0;

const isDialogVisible = ref(false);
const isEdit = ref(true);

// ========================================
// Computed
// ========================================
const accounts = computed((): any => {
  return accountsStore.accounts;
});

// ========================================
// Methods
// ========================================
// TODO:残高表示
// TODO:indexに-1が入る
// TODO:ユーザ情報としてカラー情報を持たせるか？
// TODO:アカウント新規追加・編集・削除どこでやるか。

function goToAccountDetailView(accountId: number) {
  router.push({ name: 'AccountDetailView', params: { id: accountId } });
}

function editClick(index: number) {
  // v-bind:to="{ name: 'AccountDetailView', params: { id: scope.row.id } }
  // isDialogVisible.value = !isDialogVisible.value;
  // isEdit.value = true;
  // Object.assign(form, account.value.balance_history[index]);
}

function deleteClick(index: number) {
  // accountsStore.deleteBalanceHistory(props.accountId, account.value.balance_history[index]);
}

function getColor(name: string, index: number): string {
  // if (index < 0) return;

  if (name === prevName) {
    // 前のアイテムとnameが同じ場合は前の色を再利用
    return colors[prevColorIndex];
  } else if (index === 0) {
    prevName = name;
    return colors[prevColorIndex];
  } else {
    // 前のアイテムとnameが異なる場合は次の色を使用し、prevNameとprevColorIndexを更新
    prevName = name;
    prevColorIndex = (prevColorIndex + 1) % colors.length;
    return colors[prevColorIndex];
  }
}
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-text tag="p" size="large">Accounts</el-text>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="accounts" style="width: 100%">
          <!-- <el-table-column prop="date" label="Date" width="180" /> -->
          <el-table-column prop="user" label="User" width="80">
            <template #default="scope">
              <el-avatar :style="{ backgroundColor: getColor(scope.row.user, scope.$index) }">
                {{ scope.row.user[0].toUpperCase() }}
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name" width="380" />

          <el-table-column prop="type" label="Type">
            <template #default="scope">
              <el-tag class="ml-2" type="info" effect="dark">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="Balance" width="180">¥9,999</el-table-column>
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
                @click="goToAccountDetailView(scope.row.id)"
                :icon="Search"
                circle
              ></el-button>
              <!-- </RouterLink> -->
              <el-button
                class="main-icon-button"
                color="#30343d"
                @click="editClick(scope.$index)"
                :icon="Edit"
                circle
              ></el-button>
              <el-button
                class="sub-icon-button"
                color="#30343d"
                @click="deleteClick(scope.$index)"
                :icon="Delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
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

.background-color-black {
  background-color: #30343d;
}

.main-icon-button {
  border-color: #c7a780;
  color: #c0b09d;
}

.sub-icon-button {
  border-color: #6fd4c3;
  color: #6fd4c3;
}

.normal-icon-button {
  border-color: #909399;
  color: #909399;
}
</style>
