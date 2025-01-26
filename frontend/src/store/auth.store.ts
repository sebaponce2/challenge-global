import {create, StateCreator} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const storeApi: StateCreator<AuthState> = set => ({
  isAuthenticated: false,
  user: null,
  login: (email: string) => set({isAuthenticated: true, user: email}),
  logout: () => set({isAuthenticated: false, user: null}),
});

export const useAuthStore = create<AuthState>()(storeApi);