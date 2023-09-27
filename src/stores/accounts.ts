import { defineStore } from 'pinia';
import { supabase } from '../lib/supabaseClient';
// import axios from '../axios';
import showMessage from '../CustomMessage';

const TABLE_NAME = 'accounts';

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
        console.log(accountId, state.accounts);
        console.log(state.accounts.find((item: any) => item.id == accountId));
        // const account = state.accounts.get(id) as any;
        return state.accounts.find((item: any) => item.id == accountId);
      };
    }
  },
  actions: {
    async fetchAccounts() {
      try {
        // TODO:期間固定
        const { data, error } = await supabase.functions.invoke(
          'accounts-with-balances?startDate=2023-01-01&endDate=2023-12-31'
        );

        if (error) throw error;

        this.accounts = data;
        showMessage('アカウントを取得しました。', 'success');
      } catch (error) {
        console.error('Error:', error);
        showMessage('アカウントの取得に失敗しました。', 'error');
      }
    },
    // ========================
    // アカウント
    // ========================
    async addAccount(addItem: any) {
      try {
        // 認証済みユーザID取得
        const {
          data: { user }
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from(TABLE_NAME)
          .insert([
            {
              name: addItem.accountName,
              type: addItem.accountType,
              owner_id: addItem.ownerId,
              user_id: user.id
            }
          ])
          .select();

        if (error) throw error;

        this.accounts.push({
          id: data[0].id,
          accountName: data[0].name,
          accountType: data[0].type,
          ownerId: data[0].owner_id,
          balances: {
            latestBalance: 0,
            latestDate: null,
            history: []
          }
        });
        showMessage('アカウントが登録されました。', 'success');
      } catch (error) {
        console.error('Error:', error);
        showMessage('アカウントの登録に失敗しました。', 'error');
      }
    },
    async editAccount(editItem: any) {
      try {
        const accountId = editItem.id;
        const { error } = await supabase
          .from(TABLE_NAME)
          .update({
            name: editItem.accountName,
            type: editItem.accountType,
            owner_id: editItem.ownerId
          })
          .eq('id', accountId);

        if (error) throw error;

        const updateAccount = this.getById(accountId);
        Object.assign(updateAccount, editItem);

        showMessage('アカウントが更新されました。', 'success');
      } catch (error: any) {
        console.error('Error:', error);
        showMessage('アカウントの更新に失敗しました。', 'error');
      }
    },
    async deleteAccount(accountId: string) {
      try {
        const { error } = await supabase.from(TABLE_NAME).delete().eq('id', accountId);
        if (error) throw error;

        const indexToDelete = this.accounts.findIndex((item: any) => item.id === accountId);
        if (indexToDelete !== -1) {
          this.accounts.splice(indexToDelete, 1);
        }
        showMessage('アカウントが削除されました。', 'success');
      } catch (error: any) {
        console.error('Error:', error);
        showMessage('アカウントの削除に失敗しました。', 'error');
      }
    }
  }
});
