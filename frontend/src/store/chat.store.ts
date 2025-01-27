import {create} from 'zustand';
import {createNewMessageClient, getChatMessagesClient} from '../services/chat';

interface Contact {
  name: string;
  lastName: string;
  id: string;
}

export interface Message {
  sender: string;
  content: string;
  time: string;
  attachmentName?: string;
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
  postMessage: (body: Message) => void;
  updateChat: (received: any) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
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
  async postMessage(body: any) {
    try {
      await createNewMessageClient(body);
      set({
        chat: {
          ...get().chat!,
          messages: [
            ...(get().chat?.messages || []),
            {
              sender: 'You',
              content: body.content,
              time: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
              }),
            },
          ],
        }
      })
    } catch (error) {
      console.log('Hubo un error al enviar el mensaje:', error);
    }
  },
  updateChat(received) {
    set({
      chat: {
        ...get().chat!,
        messages: [
          ...(get().chat?.messages || []),
          received.message
        ],
      },
    });
  }
}));
