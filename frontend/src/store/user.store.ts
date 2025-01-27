import { create } from "zustand"
interface UserState {
  updateProfile: (updates: Partial<User>) => void
}

export const useUserStore = create<UserState>((set) => ({

  updateProfile: (updates) =>
    set((state) => ({
      
    })),

}))
