import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import axios from '../axios';
import showMessage from '../CustomMessage';
import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'balances';

export const useBalancesStore = defineStore('balances', {
  //保持したいデータ
  state: () => {
    return {
      balances: [] as any
    };
  },
  getters: {
    getById: (state) => {
      return (balanceId: string): any => {
        return state.balances.find((item: any) => item.id === balanceId);
      };
    }
  },
  actions: {
    async fetchBalancesByAccountId(accountId: string) {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select()
          .eq('account_id', accountId);

        if (error) throw error;

        this.balances = data;
        this.balances.sort((a: any, b: any) => dayjs(b.balance_date).diff(dayjs(a.balance_date)));
        showMessage('アカウントを取得しました。', 'success');
      } catch (error) {
        console.error('Error:', error);
        showMessage('アカウントの取得に失敗しました。', 'error');
      }
    },
    // ========================
    // 残高履歴
    // ========================
    async addBalance(addItem: any) {
      try {
        // 認証済みユーザID取得
        const {
          data: { user }
        }: any = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from(TABLE_NAME)
          .insert([
            {
              account_id: addItem.account_id,
              amount: addItem.amount,
              memo: addItem.memo,
              balance_date: dayjs(addItem.balance_date).format('YYYY-MM-01'),
              user_id: user.id
            }
          ])
          .select();

        if (error) throw error;

        this.balances.push(data[0]);
        this.balances.sort((a: any, b: any) => dayjs(b.balance_date).diff(dayjs(a.balance_date)));
        showMessage('残高情報が登録されました。', 'success');
      } catch (error) {
        console.error('Error:', error);
        showMessage('残高情報の登録に失敗しました。', 'error');
      }
    },
    async editBalance(editItem: any) {
      // const balanceId = editItem._id;
      // axios
      //   .patch(`/balances/${balanceId}`, editItem)
      //   .then((response: any) => {
      //     const updateBalance = this.getById(balanceId);
      //     Object.assign(updateBalance, response.data.balance);
      //     showMessage('残高情報が更新されました。', 'success');
      //   })
      //   .catch((error: any) => {
      //     console.error('Error:', error);
      //     showMessage('残高情報の更新に失敗しました。', 'error');
      //   });
      try {
        const balanceId = editItem.id;
        const { error } = await supabase.from(TABLE_NAME).update(editItem).eq('id', balanceId);

        if (error) throw error;

        const updateBalance = this.getById(balanceId);

        Object.assign(updateBalance, editItem);

        showMessage('残高情報が更新されました。', 'success');
      } catch (error: any) {
        console.error('Error:', error);
        showMessage('残高情報の更新に失敗しました。', 'error');
      }
    },
    async deleteBalance(balanceId: string) {
      // axios
      //   .delete(`/balances/${balanceId}`)
      //   .then((response: any) => {
      //     const indexToDelete = this.balances.findIndex((item: any) => item._id === balanceId);
      //     if (indexToDelete !== -1) {
      //       this.balances.splice(indexToDelete, 1);
      //     }
      //     showMessage('残高情報が削除されました。', 'success');
      //   })
      //   .catch((error: any) => {
      //     console.error('Error:', error);
      //     showMessage('残高情報の削除に失敗しました。', 'error');
      //   });

      try {
        const { error } = await supabase.from(TABLE_NAME).delete().eq('id', balanceId);
        if (error) throw error;

        const indexToDelete = this.balances.findIndex((item: any) => item.id === balanceId);
        if (indexToDelete !== -1) {
          this.balances.splice(indexToDelete, 1);
        }
        showMessage('残高情報が削除されました。', 'success');
      } catch (error: any) {
        console.error('Error:', error);
        showMessage('残高情報の削除に失敗しました。', 'error');
      }
    }
  }
});
