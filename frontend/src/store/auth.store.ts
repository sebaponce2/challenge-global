import {create, StateCreator} from 'zustand';
import {getUserLoginClient} from '../services/user';

interface AuthState {
  user: User | null;
  login: (email: string) => void;
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
  logout: () => set({user: null}),
});

export const useAuthStore = create<AuthState>()(storeApi);