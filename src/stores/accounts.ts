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
    },

    // ========================
    // 残高履歴
    // ========================
    async addBalanceHistory(accountId: string, addItem: any) {
      axios
        .post('/balances', addItem)
        .then((response: any) => {
          const account = this.getById(accountId);

          account.balances.history.push(response.data.balance);
          account.balances.history.sort(
            (a: any, b: any) => new Date(b.balanceDate) - new Date(a.balanceDate)
          );

          showMessage('残高情報が登録されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('残高情報の登録に失敗しました。', 'error');
        });
    },
    async editBalanceHistory(accountId: string, editItem: any) {
      const balanceId = editItem._id;
      axios
        .patch(`/balances/${balanceId}`, editItem)
        .then((response: any) => {
          const updateAccount = this.getById(accountId);
          const updateBalance = updateAccount.balances.history.find(
            (item: any) => item._id === balanceId
          );
          Object.assign(updateBalance, response.data.balance);

          showMessage('残高情報が更新されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('残高情報の更新に失敗しました。', 'error');
        });
    },
    async deleteBalanceHistory(accountId: string, deleteItem: any) {
      const balanceId = deleteItem._id;
      axios
        .delete(`/balances/${balanceId}`)
        .then((response: any) => {
          const deleteAccount = this.getById(accountId);
          const indexToDelete = deleteAccount.balances.history.findIndex(
            (item: any) => item._id === balanceId
          );

          if (indexToDelete !== -1) {
            deleteAccount.balances.history.splice(indexToDelete, 1);
          }

          showMessage('残高情報が削除されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('残高情報の削除に失敗しました。', 'error');
        });
    }
  }
});
