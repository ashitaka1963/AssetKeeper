import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import users_sample from '../../tmp/json/users.json';

export const useUsersStore = defineStore('users', {
  //保持したいデータ
  state: () => {
    return {
      users: [] as any
    };
  },
  getters: {
    getById: (state) => {
      return (id: number): any => {
        return state.users.find((item: any) => item.id === id);
      };
    }
  },
  actions: {
    async fetchUsers() {
      this.users = users_sample.users;
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
    async addUser(addItem: any) {
      this.users.push(addItem);
    },
    async editUser(editItem: any) {
      const user = this.getById(editItem.id);
      Object.assign(user, editItem);
    },
    async deleteUser(id: number) {
      // const account = this.getById(id);
      // // const balanceData = account.balance_history.find(
      // //   (item: any) => item.month === editItem.month
      // // );

      const indexToDelete = this.users.findIndex((item: any) => item.id === id);

      if (indexToDelete !== -1) {
        this.users.splice(indexToDelete, 1);
      }
    }
  }
});
