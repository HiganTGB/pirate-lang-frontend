<template>
  <div class="container mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8">
    <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-8">Thông tin Hồ sơ</h2>

    <div v-if="!isEditing" class="profile-display text-center">
      <div class="mb-8">
        <img
            :src="user.AvatarUrl || 'https://via.placeholder.com/150/F3F4F6/9CA3AF?text=Ảnh'"
            alt="Ảnh đại diện"
            class="w-36 h-36 rounded-full object-cover mx-auto ring-4 ring-green-500 shadow-lg mb-4"
        />
        <h3 class="text-2xl font-semibold text-gray-700">{{ user.FullName }}</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div class="info-item bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md">
          <strong class="block text-blue-800 text-lg mb-1">Ngày sinh:</strong>
          <span class="text-gray-700">{{ formattedBirthday }}</span>
        </div>
        <div class="info-item bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md">
          <strong class="block text-blue-800 text-lg mb-1">Giới tính:</strong>
          <span class="text-gray-700">{{ displayGender }}</span>
        </div>
        <div class="info-item bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md">
          <strong class="block text-blue-800 text-lg mb-1">Số điện thoại:</strong>
          <span class="text-gray-700">{{ user.PhoneNumber }}</span>
        </div>
        <div class="info-item bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md">
          <strong class="block text-blue-800 text-lg mb-1">Địa chỉ:</strong>
          <span class="text-gray-700">{{ user.Address }}</span>
        </div>
      </div>
      <div class="info-item bg-gray-50 border-l-4 border-gray-600 p-4 rounded-md mt-4 text-left">
        <strong class="block text-gray-800 text-lg mb-1">Giới thiệu:</strong>
        <p class="text-gray-700 whitespace-pre-wrap">{{ user.Bio || 'Chưa có thông tin giới thiệu.' }}</p>
      </div>

      <button
          @click="startEditing"
          class="mt-8 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
      >
        Chỉnh sửa hồ sơ
      </button>
    </div>

    <div v-else class="profile-edit p-6 border border-gray-200 rounded-lg bg-gray-50">
      <h3 class="text-2xl font-bold text-center text-gray-700 mb-6">Chỉnh sửa Hồ sơ</h3>
      <form @submit.prevent="saveProfile">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div class="form-group">
            <label for="fullName" class="block text-gray-700 text-sm font-bold mb-2">Họ và tên:</label>
            <input
                type="text"
                id="fullName"
                v-model="editableUser.FullName"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="form-group">
            <label for="birthday" class="block text-gray-700 text-sm font-bold mb-2">Ngày sinh:</label>
            <input
                type="date"
                id="birthday"
                v-model="editableUser.Birthday"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="form-group">
            <label for="gender" class="block text-gray-700 text-sm font-bold mb-2">Giới tính:</label>
            <select
                id="gender"
                v-model="editableUser.Gender"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div class="form-group">
            <label for="phoneNumber" class="block text-gray-700 text-sm font-bold mb-2">Số điện thoại:</label>
            <input
                type="tel"
                id="phoneNumber"
                v-model="editableUser.PhoneNumber"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="form-group md:col-span-2">
            <label for="address" class="block text-gray-700 text-sm font-bold mb-2">Địa chỉ:</label>
            <input
                type="text"
                id="address"
                v-model="editableUser.Address"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="form-group md:col-span-2">
            <label for="avatarUrl" class="block text-gray-700 text-sm font-bold mb-2">URL Ảnh đại diện:</label>
            <input
                type="url"
                id="avatarUrl"
                v-model="editableUser.AvatarUrl"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="form-group md:col-span-2">
            <label for="bio" class="block text-gray-700 text-sm font-bold mb-2">Giới thiệu:</label>
            <textarea
                id="bio"
                v-model="editableUser.Bio"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            ></textarea>
          </div>
        </div>

        <div class="form-actions flex justify-end gap-4 mt-8">
          <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Lưu
          </button>
          <button
              type="button"
              @click="cancelEditing"
              class="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

// 1. Định nghĩa Interface (TypeScript)
interface UserProfile {
  UserId: string; // UUID thường được biểu diễn bằng string trong JS/TS
  FullName: string;
  Birthday: string | null; // Dạng ISO string hoặc null nếu không có
  Gender: 'male' | 'female' | 'other' | ''; // Giới tính có thể là một trong các giá trị này hoặc rỗng
  PhoneNumber: string;
  Address: string;
  AvatarUrl: string;
  Bio: string;
}

// 2. Dữ liệu người dùng giả định với kiểu dữ liệu
const user = reactive<UserProfile>({
  UserId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  FullName: 'Nguyễn Thị B',
  Birthday: '1995-11-20T00:00:00Z', // Chuỗi ISO 8601
  Gender: 'female',
  PhoneNumber: '0987654321',
  Address: '456 Đường XYZ, Quận 3, TP.HCM',
  AvatarUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  Bio: 'Tôi là một nhà phát triển phần mềm fullstack, thích học hỏi và chia sẻ kiến thức. Mong muốn kết nối với những người cùng chí hướng.',
});

// 3. Biến trạng thái
const isEditing = ref<boolean>(false);

// 4. Dữ liệu chỉnh sửa với kiểu dữ liệu
const editableUser = reactive<UserProfile>({
  UserId: '',
  FullName: '',
  Birthday: null,
  Gender: '',
  PhoneNumber: '',
  Address: '',
  AvatarUrl: '',
  Bio: '',
});

// --- Computed Properties ---

// Định dạng ngày sinh
const formattedBirthday = computed<string>(() => {
  if (!user.Birthday) return 'Chưa cập nhật';
  try {
    const date = new Date(user.Birthday);
    if (isNaN(date.getTime())) { // Kiểm tra ngày hợp lệ
      return 'Ngày không hợp lệ';
    }
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting birthday:", error);
    return 'Lỗi định dạng ngày';
  }
});

// Hiển thị giới tính
const displayGender = computed<string>(() => {
  switch (user.Gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    case 'other':
      return 'Khác';
    default:
      return 'Không xác định';
  }
});

// --- Methods ---

const startEditing = (): void => {
  // Đảm bảo dữ liệu được sao chép đúng kiểu và không tham chiếu
  Object.assign(editableUser, JSON.parse(JSON.stringify(user)));
  isEditing.value = true;
};

const saveProfile = (): void => {
  // Logic để gửi editableUser lên server (ví dụ: dùng axios/fetch và kiểm tra lỗi)
  console.log('Lưu thông tin người dùng:', editableUser);

  // Giả định API call thành công, cập nhật dữ liệu chính
  Object.assign(user, editableUser);
  isEditing.value = false;
  alert('Thông tin hồ sơ đã được cập nhật thành công!');
};

const cancelEditing = (): void => {
  isEditing.value = false;
};

// Lifecycle Hook
onMounted(() => {
  // Đây là nơi bạn sẽ gọi API để tải dữ liệu profile thực sự
  console.log('Component UserProfile đã được mount. Sẵn sàng tải dữ liệu từ API.');
  // Ví dụ: fetchDataFromAPI();
});
</script>