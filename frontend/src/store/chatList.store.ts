import {create, StateCreator} from 'zustand';

interface Contact {
    name: string
    lastName: string
    id: string
  }
  
  export interface Chat {
    id: number
    contact: Contact
    lastMessage: string
    lastMessageTime: string
  }

interface ChatState {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

const storeApi: StateCreator<ChatState> = set => ({
  chats: [],
  setChats: chats => set({chats}),
});

export const useChatListStore = create<ChatState>()(storeApi);