import { create } from "zustand"

interface Contact {
  name: string
  lastName: string
  id: string
}

export interface Message {
  sender: string
  content: string
  time: string
  attachment?: {
    type: 'image' | 'file'
    url: string
  }
}

export interface Chat {
  id: number
  contact: Contact
  lastMessage: string
  lastMessageTime: string
}

export interface SpecificChat {
  contactId: string
  messages: Message[]
}

interface ChatState {
  chats: Chat[]
  specificChats: SpecificChat[]
  setChats: (chats: Chat[]) => void
  setSpecificChats: (specificChats: SpecificChat[]) => void
  addMessage: (contactId: string, message: Message) => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  specificChats: [],
  setChats: (chats) => set({ chats }),
  setSpecificChats: (specificChats) => set({ specificChats }),
  addMessage: (contactId, message) =>
    set((state) => ({
      specificChats: state.specificChats.map((chat) =>
        chat.contactId === contactId
          ? {
              ...chat,
              messages: [...chat.messages, message],
            }
          : chat
      ),
      chats: state.chats.map((chat) =>
        chat.contact.id === contactId
          ? {
              ...chat,
              lastMessage: message.content,
              lastMessageTime: message.time,
            }
          : chat
      ),
    })),
}))
