import {create, StateCreator} from 'zustand';
import {getChatListClient} from '../services/chat';

interface ChatState {
  chats: ChatList[];
  getChats: (user_id: number) => void;
}

const storeApi: StateCreator<ChatState> = set => ({
  chats: [],
  async getChats(user_id: number) {
    try {
      const chats = await getChatListClient(user_id);
      set({chats});
    } catch (error) {
      console.log('Error al obtener la lista de chats:', error);
    }
  },
});

export const useChatListStore = create<ChatState>()(storeApi);
