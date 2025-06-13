import {type Ref, ref} from 'vue';

interface ApiErrorDetail {
    field: string;
    message: string;
}

interface ApiResponseError {
    status?: string;
    code: number;
    message: string;
    details?: ApiErrorDetail[];
}

export function useFormErrors() {
    // Lỗi tổng quát, ví dụ: lỗi mạng, lỗi server không rõ, hoặc lỗi message chung từ API
    const generalError: Ref<string | null> = ref(null);

    // Lỗi validation cho từng trường input (ví dụ: email, password)
    const fieldErrors: Ref<{ [key: string]: string }> = ref({});

    // Xóa tất cả các lỗi hiện có
    const clearErrors = () => {
        generalError.value = null;
        fieldErrors.value = {};
    };

    // Xử lý và phân loại lỗi từ phản hồi API
    const handleApiError = (error: any) => {
        clearErrors(); // Xóa lỗi cũ trước khi xử lý lỗi mới

        // Kiểm tra nếu error là một instance của Error
        if (error instanceof Error) {
            generalError.value = error.message || 'Đã xảy ra lỗi không xác định.';
            return;
        }

        const apiError: ApiResponseError = error;

        // Lỗi từ Validation (có trường 'details')
        if (apiError.details && Array.isArray(apiError.details) && apiError.details.length > 0) {
            apiError.details.forEach(detail => {
                if (detail.field && detail.message) {
                    fieldErrors.value[detail.field] = detail.message;
                }
            });
            // Đặt thông báo lỗi chung cho validation
            generalError.value = apiError.message || 'Vui lòng kiểm tra lại thông tin nhập.';
        }
        // Lỗi chỉ có message
        else if (apiError.message) {
            generalError.value = apiError.message;
        }
        // Lỗi hệ thống hoặc lỗi không xác định khác
        else {
            generalError.value = 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.';
        }
    };

    return {
        generalError,
        fieldErrors,
        clearErrors,
        handleApiError,
    };
}