import { ref, reactive, computed } from 'vue';

interface BackendErrorPayload {
    status: string;
    code: number;
    message: string;
    details?: any;
}

interface HandledError {
    message: string;
    details?: any;
    statusCode?: number;
}

// Helper function to extract a more concise error message
function extractConciseMessage(fullMessage: string): string {
    const parts = fullMessage.split(':');
    return parts.length > 1 ? parts[parts.length - 1].trim() : fullMessage;
}

export function useErrorHandling() {
    const currentError = ref<HandledError | null>(null);
    const validationErrors = reactive<Record<string, string>>({});

    // Clears all active errors
    const clearError = () => {
        currentError.value = null;
        for (const key in validationErrors) {
            delete validationErrors[key];
        }
    };

    // Sets a generic error
    const setError = (message: string, details?: any, statusCode?: number) => {
        clearError(); // Always clear previous errors first
        currentError.value = { message, details, statusCode };

        // Special handling for 400 Bad Request with validation details
        if (statusCode === 400 && message === "Invalid request data" && typeof details === 'object' && details !== null && !Array.isArray(details)) {
            Object.assign(validationErrors, details);
        }
    };

    // Handles errors from API responses
    const handleApiError = (error: any) => {
        if (error.response?.data) {
            const backendError: BackendErrorPayload = error.response.data;
            const message = extractConciseMessage(backendError.message || 'An unknown error occurred from the server.');
            const statusCode = backendError.code || error.response.status;

            if (statusCode) {
                setError(message, backendError.details, statusCode);
            } else {
                setError('An unknown server error occurred with an unexpected format.', error.response.data, error.response.status);
            }
        } else if (error instanceof Error) {
            setError(error.message);
        } else {
            setError('An unexpected error occurred.');
        }
    };
    const hasError = computed(() => currentError.value !== null);

    return {
        currentError,
        validationErrors,
        hasError,
        clearError,
        setError,
        handleApiError,
    };
}