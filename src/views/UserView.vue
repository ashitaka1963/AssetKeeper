<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import showMessage from '../CustomMessage';

import PageHeader from '../components/PageHeader.vue';

import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const ruleFormRef = ref<FormInstance>();

const isTop = ref(true);

interface User {
  newPassword: string;
  reNewPassword: string;
}

const form = reactive<User>({
  newPassword: '',
  reNewPassword: ''
});

const validateBalanceDate = (rule: any, value: any, callback: any) => {
  if (form.newPassword != form.reNewPassword) {
    callback(new Error('入力したパスワードが異なります。'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<User>>({
  newPassword: [
    { required: true, message: '新しいパスワードを入力してください。', trigger: 'blur' },
    { min: 6, max: 15, message: '6文字以上15文字以内で入力してください。', trigger: 'blur' }
  ],
  reNewPassword: [
    { required: true, message: '新しいパスワード再入力を入力してください。', trigger: 'blur' },
    { min: 6, max: 15, message: '6文字以上15文字以内で入力してください。', trigger: 'blur' },
    { validator: validateBalanceDate, trigger: 'blur' }
  ]
});

async function updateUser() {
  const { data, error } = await supabase.auth.updateUser({
    password: form.newPassword
  });

  if (!error) {
    showMessage('パスワードの更新が完了しました。', 'success');

    router.push({ name: 'DashboardView' });
  }
}

async function updatePassword() {
  const formEl = ruleFormRef.value;
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      updateUser();
    } else {
      console.log('error submit!', fields);
    }
  });
}

const signOut = () => {
  supabase.auth.signOut();
};
</script>

<template>
  <main>
    <PageHeader :headerName="$t('form.header.passwordReset')" :isTop="isTop" />
    <div class="container">
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="180px" status-icon>
        <el-form-item :label="$t('form.single.newPassword')" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" show-password style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('form.single.reNewPassword')" prop="reNewPassword">
          <el-input
            v-model="form.reNewPassword"
            type="password"
            show-password
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item>
          <el-button color="#c7a780" @click="updatePassword">{{
            $t('form.button.update')
          }}</el-button>
          <el-button type="info" @click="signOut">{{ $t('form.button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </main>
</template>

<style scoped>
* {
  color: #fefefe;
}
</style>
