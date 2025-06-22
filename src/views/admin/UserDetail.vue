<template>
  <div class="container mx-auto p-4">
    <button @click="goBack" class="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Quay lại danh sách
    </button>

    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Chi tiết Người dùng</h2>

    <div v-if="userDetailLoading" class="text-center text-lg text-blue-600 animate-pulse py-8">
      Đang tải chi tiết...
    </div>
    <div v-else-if="userDetailError" class="text-center text-lg text-red-600 py-8">
      Lỗi: {{ userDetailError.message || 'Không thể tải chi tiết người dùng.' }}
    </div>
    <div v-else-if="selectedUserDetail" class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto space-y-4">
      <div class="flex items-center space-x-6 pb-4 border-b border-gray-200">
        <img v-if="selectedUserDetail.avatar_url" :src="selectedUserDetail.avatar_url" alt="Avatar" class="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md">
        <div v-else class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-5xl border-4 border-blue-400 shadow-md">
          <i class="fas fa-user-circle"></i>
        </div>
        <div>
          <p class="text-3xl font-bold text-gray-900">{{ selectedUserDetail.full_name || selectedUserDetail.user_name }}</p>
          <p class="text-lg text-gray-600">{{ selectedUserDetail.email }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>Username:</strong></div>
        <div class="text-gray-800">{{ selectedUserDetail.user_name }}</div>

        <div><strong>ID:</strong></div>
        <div class="text-gray-800">{{ selectedUserDetail.id }}</div>

        <div><strong>Ngày sinh:</strong></div>
        <div class="text-gray-800">{{ formatDate(selectedUserDetail.birthday) }}</div>

        <div><strong>Giới tính:</strong></div>
        <div class="text-gray-800">{{ selectedUserDetail.gender || 'Chưa cập nhật' }}</div>

        <div><strong>Số điện thoại:</strong></div>
        <div class="text-gray-800">{{ selectedUserDetail.phone_number || 'Chưa cập nhật' }}</div>

        <div><strong>Địa chỉ:</strong></div>
        <div class="text-gray-800">{{ selectedUserDetail.address || 'Chưa cập nhật' }}</div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <strong>Mô tả:</strong>
        <p class="text-gray-800 mt-2 whitespace-pre-wrap">{{ selectedUserDetail.bio || 'Chưa cập nhật' }}</p>
      </div>

    </div>
    <div v-else-if="!userDetailLoading" class="text-center text-lg text-gray-600 py-8">
      Không có chi tiết người dùng để hiển thị.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { get, API_BASE_URL as API_BASE } from '../../utils/api.ts';
import { useToast } from '../../hooks/useToast.ts';

const route = useRoute(); // Để truy cập các tham số của route
const router = useRouter(); // Để điều hướng

const { showError } = useToast();

interface UserProfileDetail {
  id: string;
  email: string;
  user_name: string;
  full_name: string | null;
  birthday: string | null;
  gender: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  address: string | null;
  bio: string | null;
}

const USERS_API_PATH = '/admin/users';

const selectedUserDetail = ref<UserProfileDetail | null>(null);
const userDetailLoading = ref(false);
const userDetailError = ref<Error | null>(null);

/**
 * Hàm tải chi tiết người dùng từ API.
 * Lấy ID từ route params.
 */
const fetchUserDetail = async () => {
  const userId = route.params.id as string; // Lấy ID từ tham số URL
  if (!userId) {
    userDetailError.value = new Error('Không tìm thấy ID người dùng trong URL.');
    showError('Lỗi: Không tìm thấy ID người dùng.');
    return;
  }

  userDetailLoading.value = true;
  userDetailError.value = null;
  selectedUserDetail.value = null;

  try {
    const url = `${API_BASE}${USERS_API_PATH}/${userId}/profile`;
    console.log('Fetching user detail from:', url);

    const { data: userData, error, isLoading } = await get<UserProfileDetail>(url);

    userDetailLoading.value = isLoading.value;

    if (error.value) {
      throw error.value;
    }

    if (userData.value) {
      selectedUserDetail.value = userData.value;
    } else {
      userDetailError.value = new Error('Không tìm thấy chi tiết người dùng.');
    }
  } catch (err: any) {
    userDetailError.value = err instanceof Error ? err : new Error(err.message || 'Lỗi khi tải chi tiết người dùng.');
    showError(`Lỗi tải chi tiết: ${userDetailError.value.message}`);
    console.error("Lỗi khi tải chi tiết người dùng:", err);
  } finally {
    userDetailLoading.value = false;
  }
};

/**
 * Hàm định dạng ngày giờ chuẩn ISO string thành chuỗi dễ đọc.
 * @param dateString Chuỗi ngày giờ (ISO 8601).
 * @returns Chuỗi ngày giờ đã định dạng.
 */
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Chưa cập nhật';
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  } catch (e) {
    console.error('Invalid date string:', dateString);
    return dateString;
  }
};

/**
 * Hàm quay lại trang trước đó.
 */
const goBack = () => {
  router.back(); // Quay lại trang trước trong lịch sử trình duyệt
};

// Khi component được mount, tải chi tiết người dùng
onMounted(() => {
  fetchUserDetail();
});

// Theo dõi sự thay đổi của ID trong URL (ví dụ: nếu bạn muốn chuyển đổi giữa các user detail mà không reload component)
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchUserDetail();
  }
});
</script>

<style scoped>
/* Có thể thêm các styles tùy chỉnh cho trang chi tiết */
</style>