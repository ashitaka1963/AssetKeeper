<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import PageHeader from '../components/PageHeader.vue';

import { useOwnersStore } from '@/stores/owners';
import { Delete, Edit } from '@element-plus/icons-vue';

import ConfirmDialog from '../components/parts/ConfirmDialog.vue';

import loadingUtils from '../CustomLoading';
import type { FormInstance, FormRules } from 'element-plus';

const ownersStore = useOwnersStore();
const ruleFormRef = ref<FormInstance>();

const { t } = useI18n();

const isTop = ref(true);
const isDialogVisible = ref(false);
const isConfirmDialogVisible = ref(false);
const deleteOwnerId = ref('');
const deleteOwnerName = ref('');
const isEdit = ref(true);

interface Owner {
  id: string | null;
  name: string;
  color: string;
}

const form = reactive<Owner>({
  id: null,
  name: '',
  color: '#c7a780'
});

const defaultForm: Owner = {
  id: null,
  name: '',
  color: '#c7a780'
};

const rules = reactive<FormRules<Owner>>({
  name: [
    { required: true, message: 'オーナー名を入力してください。', trigger: 'blur' },
    { min: 1, max: 15, message: '15文字以内で入力してください。', trigger: 'blur' }
  ],
  color: [
    {
      required: true,
      message: 'カラーを選択してください。',
      trigger: 'change'
    }
  ]
});

init();

// ========================================
// Computed
// ========================================

const dialogTitle = computed((): any => {
  return isEdit.value ? t('form.header.edit') : t('form.header.new');
});

const dialogButtonName = computed((): any => {
  return isEdit.value ? t('form.button.update') : t('form.button.create');
});

// ========================================
// Methods
// ========================================
async function init() {
  loadingUtils.startLoading();

  await getOwners();

  loadingUtils.closeLoading();
}

function getOwners() {
  ownersStore.fetchOwners();
}

function editDialogOpen(ownerId: string) {
  isDialogVisible.value = true;
  isEdit.value = true;

  Object.assign(form, ownersStore.getById(ownerId));
}

async function deleteOwner(ownerId: string) {
  loadingUtils.startLoading();

  await ownersStore.deleteOwner(ownerId);

  loadingUtils.closeLoading();
}

async function saveOwner() {
  loadingUtils.startLoading();

  if (isEdit.value) {
    await ownersStore.editOwner({ ...form });
  } else {
    await ownersStore.addOwner({ ...form });
  }
  isDialogVisible.value = false;
  loadingUtils.closeLoading();
}

async function submitForm() {
  const formEl = ruleFormRef.value;
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      saveOwner();
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
  deleteOwner(deleteOwnerId.value);
  onCancelButtonClick();
}

function onCancelButtonClick() {
  isConfirmDialogVisible.value = false;
  deleteOwnerName.value = '';
  deleteOwnerId.value = '';
}
</script>

<template>
  <main>
    <PageHeader :headerName="$t('form.header.owner')" :isTop="isTop" />
    <div class="container">
      <el-row>
        <el-col :span="24">
          <el-table :data="ownersStore.owners" style="width: 100%">
            <el-table-column prop="name" :label="$t('form.table.name')" />
            <el-table-column prop="color" :label="$t('form.table.color')">
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
                  >{{ $t('form.button.add') }}</el-button
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
                    deleteOwnerId = scope.row.id;
                    deleteOwnerName = scope.row.name;
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
        <el-form-item :label="$t('form.single.name')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('form.single.color')" prop="color">
          <el-color-picker v-model="form.color" />
          <span>{{ form.color }}</span>
        </el-form-item>

        <el-form-item>
          <el-button color="#c7a780" @click="submitForm">{{ dialogButtonName }}</el-button>
          <el-button type="info" @click="cancelForm">{{ $t('form.button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <ConfirmDialog
      :isDialogVisible="isConfirmDialogVisible"
      :message="`ユーザ(${deleteOwnerName})を削除しますか？`"
      @clickConfirmed="onConfirmButtonClick"
      @clickCanceled="onCancelButtonClick"
    />
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
