import { type Ref, ref } from 'vue';
import type { ResponseError } from '../type/response';

export function useFormErrors() {
    //init error type
    const generalError: Ref<string | null> = ref(null);
    const fieldErrors: Ref<{ [key: string]: string }> = ref({});
    //Check error
    const hasErrors: Ref<boolean> = ref(false);

    // Clean errors
    const clearErrors = () => {
        generalError.value = null;
        fieldErrors.value = {};
        hasErrors.value = false;
    };
    const handleApiError = (error: any) => {
        clearErrors();

        hasErrors.value = true;

        // Check errors is Error
        if (error instanceof TypeError) {
            generalError.value = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn hoặc thử lại sau.';
            return;
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 0) {
            generalError.value = 'Lỗi kết nối mạng hoặc không nhận được phản hồi từ máy chủ. Vui lòng thử lại.';
            return;
        }


        const apiError: ResponseError = error;

        // Check Details
        if (apiError.details && Array.isArray(apiError.details) && apiError.details.length > 0) {
            apiError.details.forEach(detail => {
                if (detail.field && detail.message) {
                    fieldErrors.value[detail.field] = detail.message;
                }
            });
            generalError.value = apiError.message || 'Vui lòng kiểm tra lại thông tin nhập.';
        }
        // Check Message
        else if (apiError.message) {
            generalError.value = apiError.message;
        }
        // Return if unknown
        else {
            generalError.value = 'Đã xảy ra lỗi hệ thống không xác định. Vui lòng thử lại sau.';
        }
    };

    return {
        generalError,
        fieldErrors,
        hasErrors,
        clearErrors,
        handleApiError,
    };
}