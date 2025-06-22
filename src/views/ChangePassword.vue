<template>
  <div class="container mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8 max-w-lg">
    <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-8">Đổi Mật Khẩu</h2>

    <form @submit.prevent="handleChangePassword">
      <div v-if="generalError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Lỗi!</strong>
        <span class="block sm:inline"> {{ generalError }}</span>
      </div>

      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Thành công!</strong>
        <span class="block sm:inline"> {{ successMessage }}</span>
      </div>

      <div class="mb-5">
        <label for="currentPassword" class="block text-gray-700 text-sm font-bold mb-2">Mật khẩu hiện tại:</label>
        <input
            type="password"
            id="currentPassword"
            v-model="changePasswordRequest.current_password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{'border-red-500': fieldErrors.current_password}"
        />
        <p v-if="fieldErrors.current_password" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.current_password }}</p>
      </div>

      <div class="mb-5">
        <label for="newPassword" class="block text-gray-700 text-sm font-bold mb-2">Mật khẩu mới:</label>
        <input
            type="password"
            id="newPassword"
            v-model="changePasswordRequest.new_password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{'border-red-500': fieldErrors.new_password}"
        />
        <p v-if="fieldErrors.new_password" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.new_password }}</p>
      </div>

      <div class="mb-6">
        <label for="confirmPassword" class="block text-gray-700 text-sm font-bold mb-2">Xác nhận mật khẩu mới:</label>
        <input
            type="password"
            id="confirmPassword"
            v-model="changePasswordRequest.confirm_password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{'border-red-500': fieldErrors.confirm_password}"
        />
        <p v-if="fieldErrors.confirm_password" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.confirm_password }}</p>
      </div>

      <div class="flex items-center justify-center">
        <button
            type="submit"
            :disabled="isLoading"
            class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            :class="{'opacity-50 cursor-not-allowed': isLoading}"
        >
          {{ isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useFormErrors } from '../hooks/useFormErrors';
// Import `put` và `API_BASE_URL` từ api.ts
import { put, API_BASE_URL, type ResponseError } from '../utils/api';

// Định nghĩa cấu trúc request tương ứng với Go struct của bạn
interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const router = useRouter();
const authStore = useAuthStore();
const { generalError, fieldErrors, clearErrors, handleApiError } = useFormErrors();

const isLoading = ref<boolean>(false);
const successMessage = ref<string | null>(null);

const changePasswordRequest = reactive<ChangePasswordRequest>({
  current_password: '',
  new_password: '',
  confirm_password: '',
});

const validateForm = (): boolean => {
  clearErrors();
  generalError.value = null; // Clear general error on new validation attempt
  let isValid = true;

  if (!changePasswordRequest.current_password) {
    fieldErrors.value.current_password = 'Mật khẩu hiện tại không được để trống.';
    isValid = false;
  }

  if (!changePasswordRequest.new_password) {
    fieldErrors.value.new_password = 'Mật khẩu mới không được để trống.';
    isValid = false;
  } else if (changePasswordRequest.new_password.length < 8) {
    fieldErrors.value.new_password = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
    isValid = false;
  }

  if (!changePasswordRequest.confirm_password) {
    fieldErrors.value.confirm_password = 'Xác nhận mật khẩu không được để trống.';
    isValid = false;
  } else if (changePasswordRequest.new_password !== changePasswordRequest.confirm_password) {
    fieldErrors.value.confirm_password = 'Xác nhận mật khẩu không khớp với mật khẩu mới.';
    isValid = false;
  }

  if (changePasswordRequest.current_password === changePasswordRequest.new_password && isValid) {
    // Chỉ kiểm tra nếu các lỗi khác đã hợp lệ, tránh ghi đè thông báo lỗi cụ thể hơn
    if (!fieldErrors.value.new_password) { // Chỉ gán nếu chưa có lỗi cụ thể
      fieldErrors.value.new_password = 'Mật khẩu mới không được giống mật khẩu hiện tại.';
    }
    isValid = false;
  }

  return isValid;
};

const handleChangePassword = async (): Promise<void> => {
  successMessage.value = null; // Reset thông báo thành công
  clearErrors(); // Đảm bảo xóa tất cả lỗi trước khi submit mới
  generalError.value = null;

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  try {
    const { data, error } = await put<any>(
        `${API_BASE_URL}/accounts/change-password`,
        changePasswordRequest
    );

    if (error.value) {
      handleApiError(error.value as ResponseError);
    } else {

      successMessage.value = 'Mật khẩu của bạn đã được đổi thành công!';
      // Reset form
      changePasswordRequest.current_password = '';
      changePasswordRequest.new_password = '';
      changePasswordRequest.confirm_password = '';

      // Xóa token và điều hướng sau khi đổi mật khẩu thành công
      authStore.clearTokens();
      await router.push('/login');
    }

  } catch (err: any) {
    console.error('Change password error in component:', err);
    // Nếu lỗi chưa được handleApiError xử lý (ví dụ: lỗi mạng),
    // hoặc đây là lỗi được ném ra từ `throw error.value;` ở trên,
    // hãy đảm bảo generalError được đặt.
    if (!generalError.value && Object.keys(fieldErrors.value).length === 0) {
      // Kiểm tra nếu err có thuộc tính message hoặc là một string
      generalError.value = err?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.border-red-500 {
  border-color: #ef4444 !important;
}
</style>