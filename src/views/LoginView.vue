<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';

const loading = ref(false);
const isSignUp = ref(false);
const email = ref('');
const password = ref('');

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
    alert(error.error_description || error.message);
  }
};
</script>

<template>
  <form class="row flex-center flex" @submit.prevent="handleAuth">
    <div class="col-6 form-widget">
      <h1 class="header">AssetKeeper</h1>
      <el-switch
        v-model="isSignUp"
        size="large"
        active-text="Sign Up"
        inactive-text="Sign In"
        style="--el-switch-on-color: #136ace; --el-switch-off-color: #13ce66"
      />

      <div>
        <input class="inputField" required type="email" placeholder="Your email" v-model="email" />
      </div>
      <div>
        <input
          class="inputField"
          required
          type="password"
          placeholder="Your password"
          v-model="password"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="isSignUp ? 'Sing Up' : 'Sing In'"
          :disabled="loading"
        />
      </div>
    </div>
  </form>
</template>
