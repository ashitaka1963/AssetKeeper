import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import accounts_sample from '../../tmp/json/accounts.json';

export const useAccountsStore = defineStore('accounts', {
  //保持したいデータ
  state: () => {
    return {
      count: 0,
      accounts: [] as any
    };
  },
  getters: {
    getById: (state) => {
      return (id: number): any => {
        // const account = state.accounts.get(id) as any;
        return state.accounts.find((item: any) => item.id === id);
      };
    }
  },
  actions: {
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
    },
    async addBalanceHistory(id: number, addItem: any) {
      const account = this.getById(id);
      account.balance_history.push(addItem);
    },
    async editBalanceHistory(id: number, editItem: any) {
      const account = this.getById(id);
      const balanceData = account.balance_history.find(
        (item: any) => item.month === editItem.month
      );

      Object.assign(balanceData, editItem);
    },
    async deleteBalanceHistory(id: number, deleteItem: any) {
      const account = this.getById(id);
      // const balanceData = account.balance_history.find(
      //   (item: any) => item.month === editItem.month
      // );

      const indexToDelete = account.balance_history.findIndex(
        (item: any) => item.month === deleteItem.month
      );

      if (indexToDelete !== -1) {
        account.balance_history.splice(indexToDelete, 1);
      }
    }
  }
});
