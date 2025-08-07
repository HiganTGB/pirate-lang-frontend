<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Danh sách Vai trò</h2>

    <div class="mb-4 flex justify-end">
      <button
          @click="openCreateRoleModal"
          class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Tạo Vai trò Mới
      </button>
    </div>

    <div v-if="loading" class="text-center text-lg text-blue-600 animate-pulse">
      Đang tải dữ liệu vai trò...
    </div>
    <div v-else-if="roles.length === 0 && !loading" class="text-center text-lg text-gray-600">
      Không tìm thấy vai trò nào.
    </div>
    <div v-else class="bg-white shadow-xl rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
        <tr class="bg-gray-100 border-b border-gray-200">
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            ID
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Tên Vai trò
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Mô tả
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="role in roles"
            :key="role.id"
            class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            @click="viewRoleDetail(role.id)" >
          <td class="px-5 py-3 text-sm text-gray-700 truncate max-w-[120px]">{{ role.id }}</td>
          <td class="px-5 py-3 text-sm text-gray-900 font-medium">{{ role.name }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ role.description }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showCreateRoleModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h3 class="text-2xl font-bold mb-4 text-gray-800">Tạo Vai trò Mới</h3>
        <form @submit.prevent="createRole">
          <div class="mb-4">
            <label for="roleName" class="block text-gray-700 text-sm font-bold mb-2">Tên Vai trò:</label>
            <input
                type="text"
                id="roleName"
                v-model="newRole.name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-6">
            <label for="roleDescription" class="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
            <textarea
                id="roleDescription"
                v-model="newRole.description"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="closeCreateRoleModal"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
                type="submit"
                :disabled="creatingRole"
                class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="creatingRole">Đang tạo...</span>
              <span v-else>Tạo Vai trò</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  get,
  post,
  API_BASE_URL as API_BASE,
} from '../../utils/api.ts';
import {useToast} from "../../hooks/useToast.ts";

const { showError, showSuccess } = useToast();

const router = useRouter();

interface Role {
  id: string;
  name: string;
  description: string;
}

const ROLES_API_PATH = '/admin/rbac/roles';

const roles: Ref<Role[]> = ref([]);
const loading = ref(true);


const showCreateRoleModal = ref(false);
const newRole = ref({ name: '', description: '' });
const creatingRole = ref(false);


const fetchRoles = async () => {
  loading.value = true;
  try {
    const url = `${API_BASE}${ROLES_API_PATH}`;
    console.log('Fetching roles from:', url);

    const { data: responseData, error, isLoading } = await get<Role[]>(url);

    loading.value = isLoading.value;

    if (error.value) {
      throw error.value;
    }

    if (responseData.value) {
      roles.value = responseData.value;
    } else {
      roles.value = [];
    }

  } catch (error: any) {
    console.error("Lỗi khi tải dữ liệu vai trò:", error);
    roles.value = [];
    loading.value = false;
    showError(`Lỗi tải danh sách vai trò: ${error.message || 'Lỗi không xác định'}`);
  }
};


const viewRoleDetail = (roleId: string) => {
  router.push({ name: 'RoleDetail', params: { id: roleId } });
};


const openCreateRoleModal = () => {
  newRole.value = { name: '', description: '' }; // Reset form
  showCreateRoleModal.value = true;
};


const closeCreateRoleModal = () => {
  showCreateRoleModal.value = false;
};


const createRole = async () => {
  creatingRole.value = true;
  try {
    const url = `${API_BASE}${ROLES_API_PATH}`;
    console.log('Creating role with data:', newRole.value);

    const { data: createdRole, error } = await post<Role>(url, newRole.value);

    if (error.value) {
      throw error.value;
    }

    if (createdRole.value) {
      showSuccess(`Vai trò "${createdRole.value.name}" đã được tạo thành công!`);
      closeCreateRoleModal();
      await fetchRoles();
    } else {
      showError('Không nhận được dữ liệu vai trò đã tạo từ máy chủ.');
    }
  } catch (error: any) {
    console.error("Lỗi khi tạo vai trò:", error);
    showError(`Lỗi tạo vai trò: ${error.message || 'Lỗi không xác định'}`);
  } finally {
    creatingRole.value = false;
  }
};

onMounted(() => {
  fetchRoles();
});
</script>

<style scoped>

</style>