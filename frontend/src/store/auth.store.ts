import {create, StateCreator} from 'zustand';
import {getUserLoginClient, updateUserDataClient} from '../services/user';

interface AuthState {
  user: User | null;
  login: (email: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

const storeApi: StateCreator<AuthState> = set => ({
  isAuthenticated: false,
  user: null,
  async login(email: string) {
    try {
      const data = await getUserLoginClient(email);
      if (data) {
        set({user: data});
      }
    } catch (error) {
      throw error;
    }
  },
  async updateUser(body: any) {
    try {
      await updateUserDataClient(body);
      set({user: body});
    } catch (error) {
      console.log(
        'Se produjo un error al actualizar el perfil del usuario',
        error,
      );
    }
  },
  logout: () => set({user: null}),
});

export const useAuthStore = create<AuthState>()(storeApi);
