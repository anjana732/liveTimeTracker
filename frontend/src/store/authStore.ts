import { create } from 'zustand';

export interface User {
    id: string;
    userName: string;
    email: string;
    name: string;
    role: 'admin' | 'intern';
}

interface AuthState {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

// Rename useAuth to useAuthStore for consistency
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    login: (user: User) => set({ user }),
    logout: () => set({ user: null }),
}));
