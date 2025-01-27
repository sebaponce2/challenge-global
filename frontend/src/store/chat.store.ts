import {create} from 'zustand';
import {getChatMessagesClient} from '../services/chat';

interface Contact {
  name: string;
  lastName: string;
  id: string;
}

export interface Message {
  sender: string;
  content: string;
  time: string;
  attachment?: {
    type: 'image' | 'file';
    url: string;
  };
}

export interface Chat {
  id: number;
  contact: Contact;
  lastMessage: string;
  lastMessageTime: string;
}

interface ChatState {
  chat: SpecificChat | null;
  getMessages: (chatId: number, userId: number) => void;
  addMessage: (contactId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>(set => ({
  chat: null,
  async getMessages(chatId, userId) {
    try {
      const chat = await getChatMessagesClient(chatId, userId);
      set({
        chat,
      });
    } catch (error) {
      console.log('Hubo un error al obtener los mensajes:', error);
    }
  },
  addMessage: (contactId, message) => {},
}));
