
import { defineStore } from 'pinia';

import { post, API_BASE_URL } from '../utils/api';
import type {LoginResponseData} from '../type/dto'

interface AuthState {
    access_token: string | null;
    refresh_token: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        access_token: null,
        refresh_token: null,
    }),
    getters: {
        isAuthenticated: (state): boolean => !!state.access_token,
        getAccessToken: (state): string | null => state.access_token,
        getRefreshToken: (state): string | null => state.refresh_token,
    },
    actions: {
        setTokens(accessToken: string, refreshToken: string): void {
            this.access_token = accessToken;
            this.refresh_token = refreshToken;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
        },
        clearTokens(): void {
            this.access_token = null;
            this.refresh_token = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
        initializeTokens(): void {
            const storedAccessToken = localStorage.getItem('access_token');
            const storedRefreshToken = localStorage.getItem('refresh_token');
            if (storedAccessToken && storedRefreshToken) {
                this.access_token = storedAccessToken;
                this.refresh_token = storedRefreshToken;
            }
        },
        async login(credentials: { email: string; password: string }): Promise<LoginResponseData | null> {
            try {
                const { data, error } = await post<LoginResponseData>(`${API_BASE_URL}/accounts/login`, credentials);

                if (error.value) {
                    throw error.value;
                }
                if (data.value) {
                    const accessToken = data.value.access_token;
                    const refreshToken = data.value.refresh_token;
                    this.setTokens(accessToken, refreshToken);
                    console.log('Login successful in store:', data.value);
                    return data.value;
                }
                return null;
            } catch (err: any) {
                throw err;
            }
        },
            // TODO: refresh function
        // async refreshAccessToken(): Promise<boolean> {

        // }
    },
});