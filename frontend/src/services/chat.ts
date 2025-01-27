import {client} from './clients';

export const getChatListClient = async (userId: number): Promise<ChatList[]> => {
  try {
    const {data} = await client.get('/getChatList', {
      params: {userId},
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getChatMessagesClient = async (chatId: number, userId: number): Promise<SpecificChat> => {
  try {
    const {data} = await client.get('/getChatMessages', {
      params: {chatId, userId},
    });
    return data;
  } catch (error) {
    throw error;
  }
}