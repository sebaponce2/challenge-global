interface Contact {
  id: string;
  name: string;
  lastName: string;
}

interface ChatList {
    id: number;
    contact: Contact;
    lastMessage: string;
    lastMessageTime: string;
}



interface SpecificChatMessage {
  sender: string;
  content: string;
  time: string;
}

interface SpecificChat {
  contactId: number;
  messages?: SpecificChatMessage[] | [];
}
