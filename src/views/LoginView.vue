<script setup lang="ts">
// TODO:新規ユーザー登録
// TODO:パスワード忘れ画面
// TODO:ロゴ追加
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import PasswordResetView from './PasswordResetView.vue';

import { Message, Lock } from '@element-plus/icons-vue';
import showMessage from '../CustomMessage';

const isSignUp = ref(false);
const email = ref('');
const password = ref('');
const isDialogVisible = ref(true);

const handleAuth = async () => {
  try {
    if (isSignUp.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      });
      if (error) throw error;
    } else {
      let { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      });
      if (error) throw error;
    }
  } catch (error: any) {
    showMessage('メールアドレスまたはパスワードが間違っています。', 'error');
    // alert(error.error_description || error.message);
  }
};
</script>

<template>
  <!-- Login -->
  <el-row class="row-bg" justify="center">
    <el-col :span="6">
      <div class="container" style="margin-top: 150px">
        <el-form>
          <div class="col-6 form-widget">
            <h2 class="header">AssetKeeper</h2>

            <el-form-item>
              <el-col :offset="18"> <el-link type="primary">Sign Up</el-link></el-col>
            </el-form-item>
            <el-form-item>
              <el-input v-model="email" :prefix-icon="Message" placeholder="Email" size="small" />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="password"
                :prefix-icon="Lock"
                type="password"
                placeholder="Password"
                size="small"
              />
            </el-form-item>
            <el-form-item>
              <el-col :offset="0">
                <el-link type="info" @click="isDialogVisible = !isDialogVisible"
                  >パスワードを忘れた場合はこちら
                </el-link>
              </el-col>
            </el-form-item>

            <el-form-item>
              <el-col :offset="15">
                <el-button type="primary" @click="handleAuth"> LOGIN </el-button></el-col
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-col>
  </el-row>
  <el-dialog
    v-model="isDialogVisible"
    title="パスワードリセット"
    width="30%"
    align-center
    :before-close="cancelForm"
    style="padding-top: 0px"
  >
    <PasswordResetView />
  </el-dialog>

  <!-- SingUp -->
  <!-- PasswordReset -->
</template>

<style scoped>
.container {
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item {
  width: 10em;
}
</style>
