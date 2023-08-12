import { defineStore } from 'pinia';
import axios from '../axios';
import showMessage from '../CustomMessage';

export const useAccountsStore = defineStore('accounts', {
  //保持したいデータ
  state: () => {
    return {
      accounts: [] as any
    };
  },
  getters: {
    getById: (state) => {
      return (accountId: string): any => {
        // const account = state.accounts.get(id) as any;
        return state.accounts.find((item: any) => item._id === accountId);
      };
    }
  },
  actions: {
    async fetchAccounts() {
      axios
        .get('/accounts-with-balances')
        .then((response: any) => {
          this.accounts = response.data;
          showMessage('アカウントを取得しました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('アカウントの取得に失敗しました。', 'error');
        });
    },
    // ========================
    // アカウント
    // ========================
    async addAccount(addItem: any) {
      axios
        .post('/accounts', addItem)
        .then((response: any) => {
          const account = response.data.account;
          account.balances = {
            latestBalance: 0,
            latestDate: null,
            history: []
          };
          this.accounts.push(account);
          showMessage('アカウントが登録されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('アカウントの登録に失敗しました。', 'error');
        });
    },
    async editAccount(editItem: any) {
      const accountId = editItem._id;

      axios
        .patch(`/accounts/${accountId}`, editItem)
        .then((response: any) => {
          const updateAccount = this.getById(accountId);
          Object.assign(updateAccount, response.data.account);

          showMessage('アカウントが更新されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('アカウントの更新に失敗しました。', 'error');
        });
    },
    async deleteAccount(accountId: string) {
      axios
        .delete(`/accounts/${accountId}`)
        .then((response: any) => {
          const indexToDelete = this.accounts.findIndex((item: any) => item._id === accountId);

          if (indexToDelete !== -1) {
            this.accounts.splice(indexToDelete, 1);
          }

          showMessage('アカウントが削除されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('アカウントの削除に失敗しました。', 'error');
        });
    }
  }
});
