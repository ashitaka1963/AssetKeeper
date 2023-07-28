import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import accounts_sample from '../../tmp/json/accounts.json';

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })

export const useAccountsStore = defineStore('accounts', {
  //保持したいデータ
  state: () => {
    return {
      count: 0,
      accounts: [] as any
    };
  },
  getters: {
    double: (state) => {
      return state.count * 2;
    }
  },
  actions: {
    increment() {
      this.count++;
    },
    async fetchAccounts() {
      this.accounts = accounts_sample.accounts;
      // try {
      //   this.loading = true;
      //   const response = await axios.get('https://api.example.com/data');
      //   this.data = response.data;
      // } catch (error) {
      //   this.error = error.message;
      // } finally {
      //   this.loading = false;
      // }
    }
  }
});
