import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import axios from '../axios';
import showMessage from '../CustomMessage';

export const useBalancesStore = defineStore('balances', {
  //保持したいデータ
  state: () => {
    return {
      balances: [] as any
    };
  },
  getters: {
    getById: (state) => {
      return (balanceid: string): any => {
        return state.balances.find((item: any) => item._id === balanceid);
      };
    }
  },
  actions: {
    async fetchBalancesByAccountId(accountId: string) {
      axios
        .get(`/balances/${accountId}`)
        .then((response: any) => {
          this.balances = response.data;
          showMessage('アカウントを取得しました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('アカウントの取得に失敗しました。', 'error');
        });
    },
    // ========================
    // 残高履歴
    // ========================
    async addBalance(addItem: any) {
      axios
        .post('/balances', addItem)
        .then((response: any) => {
          const balance = response.data.balance;

          this.balances.push(balance);
          this.balances.sort((a: any, b: any) => dayjs(b.balanceDate).diff(dayjs(a.balanceDate)));

          console.log(this.balances);

          showMessage('残高情報が登録されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('残高情報の登録に失敗しました。', 'error');
        });
    },
    async editBalance(editItem: any) {
      const balanceId = editItem._id;
      axios
        .patch(`/balances/${balanceId}`, editItem)
        .then((response: any) => {
          const updateBalance = this.getById(balanceId);
          Object.assign(updateBalance, response.data.balance);

          showMessage('残高情報が更新されました。', 'success');
        })
        .catch((error: any) => {
          console.error('Error:', error);
          showMessage('残高情報の更新に失敗しました。', 'error');
        });
    },
    async deleteBalance(balanceId: string) {
      axios
        .delete(`/balances/${balanceId}`)
        .then((response: any) => {
          const indexToDelete = this.balances.findIndex((item: any) => item._id === balanceId);

          if (indexToDelete !== -1) {
            this.balances.splice(indexToDelete, 1);
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
