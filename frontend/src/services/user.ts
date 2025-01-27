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

export const updateUserDataClient = async (body: any): Promise<User> => {
  try {
    const {data} = await client.put('/updateUserData', {
      body: body,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
