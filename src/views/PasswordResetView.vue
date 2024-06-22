<script setup lang="ts">
import { ref } from 'vue';
import showMessage from '../CustomMessage';
import { Message } from '@element-plus/icons-vue';

const email = ref('');

function resetPassword() {
  // TODO: supabaseのパスワードリセット処理
  showMessage(
    'ご入力いただいたメールアドレスにパスワードリセットのリンクを送信しました。<br>メールをご確認ください。',
    'success'
  );
}
</script>

<template>
  <el-row justify="center">
    <el-col :span="18">
      <el-form>
        <p>Eメールアドレスを入力してください</p>

        <el-form-item>
          <el-input v-model="email" :prefix-icon="Message" placeholder="Email" size="small" />
        </el-form-item>

        <el-form-item>
          <el-col :offset="15">
            <el-button type="primary" @click="resetPassword"> リセット </el-button></el-col
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped></style>
