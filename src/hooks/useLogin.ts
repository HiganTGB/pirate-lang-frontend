// useLogin.ts
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Adjust the path as needed
import { useErrorHandling } from './useErrorHandling'; // Assuming you have this hook for error management

export function useLogin() {
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false); // To manage loading state during login
    const router = useRouter();
    const authStore = useAuthStore();
    const { handleApiError, currentError, clearError } = useErrorHandling(); // Use your error handling hook

    const login = async () => {
        isLoading.value = true;
        clearError(); // Clear any previous errors before a new attempt

        try {
            const response = await fetch('http://localhost:9000/v1/accounts/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
            });

            if (!response.ok) {
                // If the response is not OK, let the error handling hook deal with it
                throw response; // Throw the response to be caught by handleApiError
            }

            const data = await response.json();

            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;

            if (accessToken && refreshToken) {
                authStore.setTokens(accessToken, refreshToken);
                alert('Đăng nhập thành công!'); // Consider using a more sophisticated notification system
                router.push('/');
            } else {
                // If tokens are missing from a successful response
                throw new Error('API did not return valid tokens.');
            }
        } catch (error: any) {
            // Centralized API error handling
            handleApiError(error);
            // Optionally, you might want to show a generic alert if currentError.value is still null
            // meaning handleApiError didn't set a specific message (e.g., network error)
            if (!currentError.value) {
                alert('Đăng nhập thất bại. Vui lòng thử lại sau.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        email,
        password,
        isLoading,
        login,
        currentError, // Expose the error from the error handling hook
    };
}