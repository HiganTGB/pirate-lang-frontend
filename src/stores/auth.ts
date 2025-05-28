
import { defineStore } from 'pinia';


interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: null,
        refreshToken: null,
    }),
    getters: {

        isAuthenticated: (state): boolean => !!state.accessToken,
        getAccessToken: (state): string | null => state.accessToken,
        getRefreshToken: (state): string | null => state.refreshToken,
    },
    actions: {

        setTokens(accessToken: string, refreshToken: string): void {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
        },
        clearTokens(): void {
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
        initializeTokens(): void {
            const storedAccessToken = localStorage.getItem('access_token');
            const storedRefreshToken = localStorage.getItem('refresh_token');
            if (storedAccessToken && storedRefreshToken) {
                this.accessToken = storedAccessToken;
                this.refreshToken = storedRefreshToken;
            }
        },
    },
});