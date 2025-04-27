import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cookieService } from '@/services/cookieService'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    setAuth: (token: string) => void
    clearAuth: () => void
}

export const useAuthViewModel = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            setAuth: (token: string) => set({ isAuthenticated: true, token }),
            clearAuth: () => {
                cookieService.clearAllAuthCookies();
                set({ isAuthenticated: false, token: null });
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                // When rehydrating from storage, check if cookies still exist
                if (state) {
                    const hasCookies = cookieService.getCookie('accessToken') !== null;
                    if (!hasCookies) {
                        state.clearAuth();
                    }
                }
            }
        }
    )
) 
