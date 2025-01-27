import {client} from './clients';

export const getUserLoginClient = async (email: string): Promise<User> => {
  try {
    const {data} = await client.get('/login', {
      params: {email},
    });
    return data;
  } catch (error) {
    throw error;
  }
};
