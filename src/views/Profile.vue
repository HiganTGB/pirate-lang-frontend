<template>
  <div class="container mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8">
    <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-8">Thông tin Hồ sơ</h2>

    <div class="text-center mb-8">
      <label for="avatar-upload" class="relative cursor-pointer group"> <img
          :src="userProfile?.avatar_url || 'https://via.placeholder.com/150/F3F4F6/9CA3AF?text=Avatar'"
          alt="Ảnh đại diện"
          class="w-36 h-36 rounded-full object-cover mx-auto ring-4 ring-green-500 shadow-lg mb-4"
          :class="{'cursor-pointer hover:ring-blue-500 transition-all duration-200': isEditing}"
      />
        <div v-if="isEditing" class="absolute bg-white rounded-md text-gray-800 px-2 py-1 left-0 bottom-0 ml-2 mb-2 border border-gray-300">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-pencil inline-block align-middle mr-1">
            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path>
          </svg>
          Edit
        </div>
      </label>
      <input v-if="isEditing"
          type="file"
          id="avatar-upload"
          ref="avatarInput"
          @change="handleAvatarChange" accept="image/*"
          class="hidden"
      />
    </div>
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Thông tin tài khoản</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div class="form-item">
          <label class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <div class="display-value p-2 bg-white border border-gray-200 rounded-md text-gray-700">
            {{ userProfile?.email || 'N/A' }}
          </div>
        </div>
        <div class="form-item">
          <label class="block text-gray-700 text-sm font-bold mb-2">Tên người dùng:</label>
          <div class="display-value p-2 bg-white border border-gray-200 rounded-md text-gray-700">
            {{ userProfile?.user_name || 'N/A' }}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Thông tin cá nhân</h3>
    <div :class="{ 'is-editing': isEditing }">
      <form @submit.prevent="saveProfile">
        <div v-if="generalError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong class="font-bold">Lỗi!</strong>
          <span class="block sm:inline"> {{ generalError }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

          <div class="form-item">
            <label for="fullName" class="block text-gray-700 text-sm font-bold mb-2">Họ và tên:</label>
            <input
                v-if="isEditing"
                type="text"
                id="fullName"
                v-model="editableUser.full_name"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{'border-red-500': fieldErrors.fullName}"
            />
            <div v-else class="display-value p-2 bg-blue-50 border border-blue-200 rounded-md text-gray-700">
              {{ userProfile?.full_name || 'Chưa cập nhật' }}
            </div>
            <p v-if="fieldErrors.fullName" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.fullName }}</p>
          </div>

          <div class="form-item">
            <label for="birthday" class="block text-gray-700 text-sm font-bold mb-2">Ngày sinh:</label>
            <input
                v-if="isEditing"
                type="date"
                id="birthday"
                v-model="editableUser.birthday"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{'border-red-500': fieldErrors.birthday}"
            />
            <div v-else class="display-value p-2 bg-blue-50 border border-blue-200 rounded-md text-gray-700">
              {{ formattedBirthday }}
            </div>
            <p v-if="fieldErrors.birthday" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.birthday }}</p>
          </div>

          <div class="form-item">
            <label for="gender" class="block text-gray-700 text-sm font-bold mb-2">Giới tính:</label>
            <select
                v-if="isEditing"
                id="gender"
                v-model="editableUser.gender"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{'border-red-500': fieldErrors.gender}"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
            <div v-else class="display-value p-2 bg-blue-50 border border-blue-200 rounded-md text-gray-700">
              {{ displayGender }}
            </div>
            <p v-if="fieldErrors.gender" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.gender }}</p>
          </div>

          <div class="form-item">
            <label for="phoneNumber" class="block text-gray-700 text-sm font-bold mb-2">Số điện thoại:</label>
            <input
                v-if="isEditing"
                type="tel"
                id="phoneNumber"
                v-model="editableUser.phone_number"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{'border-red-500': fieldErrors.phoneNumber}"
            />
            <div v-else class="display-value p-2 bg-blue-50 border border-blue-200 rounded-md text-gray-700">
              {{ userProfile?.phone_number || 'Chưa cập nhật' }}
            </div>
            <p v-if="fieldErrors.phoneNumber" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.phoneNumber }}</p>
          </div>

          <div class="form-item md:col-span-2">
            <label for="address" class="block text-gray-700 text-sm font-bold mb-2">Địa chỉ:</label>
            <input
                v-if="isEditing"
                type="text"
                id="address"
                v-model="editableUser.address"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{'border-red-500': fieldErrors.address}"
            />
            <div v-else class="display-value p-2 bg-blue-50 border border-blue-200 rounded-md text-gray-700">
              {{ userProfile?.address || 'Chưa cập nhật' }}
            </div>
            <p v-if="fieldErrors.address" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.address }}</p>
          </div>
          <div class="form-item md:col-span-2">
            <label for="bio" class="block text-gray-700 text-sm font-bold mb-2">Giới thiệu:</label>
            <textarea
                v-if="isEditing"
                id="bio"
                v-model="editableUser.bio"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                :class="{'border-red-500': fieldErrors.bio}"
            ></textarea>
            <div v-else class="display-value p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 whitespace-pre-wrap">
              {{ userProfile?.bio || 'Chưa có thông tin giới thiệu.' }}
            </div>
            <p v-if="fieldErrors.bio" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.bio }}</p>
          </div>
        </div>

        <div class="form-actions flex justify-center gap-4 mt-8">
          <button
              v-if="!isEditing"
              @click="startEditing"
              type="button"
              class="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Chỉnh sửa hồ sơ
          </button>
          <button
              v-if="isEditing"
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
          >
            Lưu
          </button>
          <button
              v-if="isEditing"
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
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useUserStore } from '../stores/user';

import { useFormErrors } from '../hooks/useFormErrors';
import type {UserProfile} from "../type/dto.ts";

interface EditableUserProfile extends UserProfile {
  avatarFile?: File | null;
}

const userStore = useUserStore();
const userProfile = computed(() => userStore.getUserProfile);
watch(userProfile, (newVal) => {
  console.log('Component userProfile changed to:', JSON.parse(JSON.stringify(newVal)));
}, { deep: true });
const isEditing = ref<boolean>(false);
const avatarInput = ref<HTMLInputElement | null>(null);

const { generalError, fieldErrors, clearErrors, handleApiError } = useFormErrors();

const editableUser = reactive<EditableUserProfile>({
  id: '',
  full_name: '',
  email :'',
  user_name:'',
  birthday: null,
  gender: '',
  phone_number: '',
  address: '',
  avatar_url: '',
  bio: '',
  avatarFile: null,
});

const formattedBirthday = computed<string>(() => {
  if (!userProfile.value?.birthday) return 'Chưa cập nhật';
  const date = userProfile.value.birthday;
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } else if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  return 'Ngày không hợp lệ';
});

const displayGender = computed<string>(() => {
  switch (userProfile.value?.gender) {
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

const startEditing = (): void => {
  clearErrors();
  if (userProfile.value) {
    Object.assign(editableUser, {
      ...userProfile.value,
      birthday: userProfile.value.birthday
          ? new Date(userProfile.value.birthday).toISOString().split('T')[0]
          : null,
      avatarFile: null,
    });
  }
  isEditing.value = true;
};

const handleAvatarChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    editableUser.avatarFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      editableUser.avatar_url = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    clearErrors();
    try {
      const newAvatarUrl = await userStore.updateAvatar(file);
      if (newAvatarUrl) {
        alert('Ảnh đại diện đã được cập nhật thành công!');
      } else {
        throw new Error('Tải ảnh đại diện lên thất bại.');
      }
    } catch (error) {
      handleApiError(error);
      alert(generalError.value || 'Có lỗi xảy ra khi cập nhật ảnh đại diện.');
    } finally {
      // Reset input file để có thể chọn lại cùng một file nếu muốn
      target.value = '';
    }
  }
};

const saveProfile = async (): Promise<void> => {
  clearErrors(); // Xóa lỗi cũ trước mỗi lần lưu

  const profileDataToUpdate: Partial<UserProfile> = {
    full_name: editableUser.full_name,
    gender: editableUser.gender,
    phone_number: editableUser.phone_number,
    address: editableUser.address,
    bio: editableUser.bio,
  };

  if (editableUser.birthday) {
    profileDataToUpdate.birthday = new Date(editableUser.birthday);
  } else {
    profileDataToUpdate.birthday = null;
  }
  try {
    const success = await userStore.updateUserProfile(profileDataToUpdate);
    if (success) {
      isEditing.value = false;
    } else {
      throw new Error('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
    }
  } catch (error) {
    handleApiError(error);
    if (generalError.value && Object.keys(fieldErrors.value).length === 0) {
      alert(generalError.value);
    }
  }
};

const cancelEditing = (): void => {
  isEditing.value = false;
  clearErrors();

  if (userProfile.value) {
    Object.assign(editableUser, {
      ...userProfile.value,
      birthday: userProfile.value.birthday
          ? new Date(userProfile.value.birthday).toISOString().split('T')[0]
          : null,
      avatarFile: null,
    });
  }
};

onMounted(() => {

});

watch(userProfile, (newUserProfile) => {
  if (newUserProfile && !isEditing.value) {
    Object.assign(editableUser, {
      ...newUserProfile,
      birthday: newUserProfile.birthday
          ? new Date(newUserProfile.birthday).toISOString().split('T')[0]
          : null,
      avatarFile: null,
    });
  }
}, { immediate: true });
</script>

<style scoped>
.border-red-500 {
  border-color: #ef4444 !important;
}
</style>