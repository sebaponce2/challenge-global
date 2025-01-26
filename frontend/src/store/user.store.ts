import { create } from "zustand"

export interface UserProfile {
  username: string
  avatar: string | null
  email: string
  status: 'online' | 'offline' | 'away'
}

interface UserState {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
  setStatus: (status: UserProfile['status']) => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    username: 'Usuario',
    avatar: null,
    email: 'usuario@example.com',
    status: 'online',
  },
  updateProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),
  setStatus: (status) =>
    set((state) => ({
      profile: { ...state.profile, status },
    })),
}))
