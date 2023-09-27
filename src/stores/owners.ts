import { defineStore } from 'pinia';
import { supabase } from '../lib/supabaseClient';
import showMessage from '../CustomMessage';

const TABLE_NAME = 'owners';

export const useOwnersStore = defineStore(TABLE_NAME, {
  state: () => {
    return {
      owners: [] as any
    };
  },
  getters: {
    getById: (state) => {
      return (ownerId: string): any => {
        return state.owners.find((item: any) => item.id === ownerId);
      };
    }
  },
  actions: {
    async fetchOwners() {
      try {
        const { data, error } = await supabase.from(TABLE_NAME).select();

        if (error) throw error;

        this.owners = data;
        showMessage('ユーザを取得しました。', 'success');
      } catch (error) {
        console.error('Error:', error);
        showMessage('ユーザの取得に失敗しました。', 'error');
      }
    },
    async addOwner(addItem: any) {
      try {
        // 認証済みユーザID取得
        const {
          data: { user }
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from(TABLE_NAME)
          .insert([{ name: addItem.name, color: addItem.color, user_id: user.id }])
          .select();

        if (error) throw error;

        this.owners.push(data[0]);
        showMessage('ユーザが登録されました。', 'success');
      } catch (error) {
        console.error('Error:', error);
        showMessage('ユーザの登録に失敗しました。', 'error');
      }
    },
    async editOwner(editItem: any) {
      try {
        const ownerId = editItem.id;
        const { error } = await supabase.from(TABLE_NAME).update(editItem).eq('id', ownerId);

        if (error) throw error;

        const updateOwner = this.getById(ownerId);
        Object.assign(updateOwner, editItem);

        showMessage('ユーザが更新されました。', 'success');
      } catch (error: any) {
        console.error('Error:', error);
        showMessage('ユーザの更新に失敗しました。', 'error');
      }
    },
    async deleteOwner(ownerId: string) {
      try {
        const { error } = await supabase.from(TABLE_NAME).delete().eq('id', ownerId);
        if (error) throw error;

        const indexToDelete = this.owners.findIndex((item: any) => item.id === ownerId);
        if (indexToDelete !== -1) {
          this.owners.splice(indexToDelete, 1);
        }
        showMessage('ユーザが削除されました。', 'success');
      } catch (error: any) {
        console.error('Error:', error);
        showMessage('ユーザの削除に失敗しました。', 'error');
      }
    }
  }
});
