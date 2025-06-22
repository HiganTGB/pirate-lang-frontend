
import { ref, type Ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import type {ServerResponse,ResponseError,LocalApiResponse} from '../type/response'

interface RequestOptions extends RequestInit {

}

/**
 * Gửi một HTTP request chung.
 * Tự động thêm Authorization header và xử lý trạng thái tải/lỗi.
 * @param url URL của request.
 * @param options Tùy chọn cho request (method, headers, body, v.v.).
 * @returns Một đối tượng phản hồi chứa data, error và isLoading dưới dạng Ref.
 */
export async function sendRequest<T>(url: string, options: RequestOptions = {}): Promise<LocalApiResponse<T>> {
    const isLoading: Ref<boolean> = ref(true);
    const error: Ref< ResponseError | null> = ref(null);
    const data: Ref<T | null> = ref(null);

    const authStore = useAuthStore();
    const accessToken = authStore.getAccessToken;

    try {
        const headers: HeadersInit = {
            ...options.headers,
        };
        if (!(options.body instanceof FormData)) {
            (headers as Record<string, string>)['Content-Type'] = 'application/json';
        }

        if (accessToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };
        console.log(config)
        const response: Response = await fetch(url, config);

        // Xử lý lỗi HTTP (ví dụ: 4xx, 5xx)
        if (!response.ok) {

            let errorData: ResponseError | null = null;
            try {
                errorData = await response.json();
            } catch (jsonError) {
                errorData = {
                    code: response.status,
                    message: `HTTP error! Status: ${response.status}`,
                };
            }

            // Check if 401 (Unauthorized)
            if (response.status === 401) {
                authStore.clearTokens();
                errorData = {
                    code: response.status,
                    message: `Unauthorized Request: ${response.status}`,
                };
            }
            throw errorData;
        }

        const serverResponse: ServerResponse<T> = await response.json();


        if (serverResponse.status === 'error') {
            throw {
                status: serverResponse.status,
                code: response.status,
                message: serverResponse.message || 'API reported an error with success status code.',
                // details: ...
            } as ResponseError;
        }

        data.value = serverResponse.data;

    } catch (err: any) {
        console.error('Request failed:', err);
        throw err
    } finally {
        isLoading.value = false;
    }

    return { data, error, isLoading };
}

export async function postFormData<T>(url: string, formData: FormData, options: RequestOptions = {}): Promise<LocalApiResponse<T>> {
    const headers: HeadersInit = {
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        method: 'POST',
        headers,
        body: formData,
    };
    return sendRequest<T>(url, config);
}

export async function get<T>(url: string, options: RequestOptions = {}): Promise<LocalApiResponse<T>> {
    return sendRequest<T>(url, { ...options, method: 'GET' });
}

export async function post<T>(url: string, body: object, options: RequestOptions = {}): Promise<LocalApiResponse<T>> {
    return sendRequest<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) });
}

export async function put<T>(url: string, body: object, options: RequestOptions = {}): Promise<LocalApiResponse<T>> {
    return sendRequest<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) });
}

export async function remove<T>(url: string, options: RequestOptions = {}): Promise<LocalApiResponse<T>> {
    return sendRequest<T>(url, { ...options, method: 'DELETE' });
}

export const API_BASE_URL = 'http://localhost:9100/v1';