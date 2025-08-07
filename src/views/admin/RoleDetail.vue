<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <button @click="goBack" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Quay lại danh sách
      </button>

      <button
          v-if="selectedRoleDetail"
          @click="openEditRoleModal"
          class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
      >
        Chỉnh sửa Vai trò
      </button>
    </div>

    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Chi tiết Vai trò</h2>

    <div v-if="roleDetailLoading" class="text-center text-lg text-blue-600 animate-pulse py-8">
      Đang tải chi tiết vai trò...
    </div>
    <div v-else-if="roleDetailError" class="text-center text-lg text-red-600 py-8">
      Lỗi: {{ roleDetailError.message || 'Không thể tải chi tiết vai trò.' }}
    </div>
    <div v-else-if="selectedRoleDetail" class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto space-y-4">
      <div class="pb-4 border-b border-gray-200">
        <p class="text-3xl font-bold text-gray-900">{{ selectedRoleDetail.name }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><strong>ID Vai trò:</strong></div>
        <div class="text-gray-800">{{ selectedRoleDetail.id }}</div>

        <div><strong>Tên Vai trò:</strong></div>
        <div class="text-gray-800">{{ selectedRoleDetail.name }}</div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <strong>Mô tả:</strong>
        <p class="text-gray-800 mt-2 whitespace-pre-wrap">{{ selectedRoleDetail.description || 'Chưa cập nhật' }}</p>
      </div>
    </div>
    <div v-else-if="!roleDetailLoading" class="text-center text-lg text-gray-600 py-8">
      Không có chi tiết vai trò để hiển thị.
    </div>

    <div v-if="showEditRoleModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h3 class="text-2xl font-bold mb-4 text-gray-800">Chỉnh sửa Vai trò</h3>
        <form @submit.prevent="updateRole">
          <div class="mb-4">
            <label for="editRoleName" class="block text-gray-700 text-sm font-bold mb-2">Tên Vai trò:</label>
            <input
                type="text"
                id="editRoleName"
                v-model="editedRole.name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-6">
            <label for="editRoleDescription" class="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
            <textarea
                id="editRoleDescription"
                v-model="editedRole.description"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="closeEditRoleModal"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
                type="submit"
                :disabled="updatingRole"
                class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="updatingRole">Đang cập nhật...</span>
              <span v-else>Cập nhật Vai trò</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { get, put, API_BASE_URL as API_BASE } from '../../utils/api.ts';
import { useToast } from '../../hooks/useToast.ts';

const route = useRoute();
const router = useRouter();

const { showError, showSuccess } = useToast();

interface Role {
  id: string;
  name: string;
  description: string;
}

const ROLES_API_PATH = '/admin/rbac/roles';

const selectedRoleDetail = ref<Role | null>(null);
const roleDetailLoading = ref(false);
const roleDetailError = ref<Error | null>(null);


const showEditRoleModal = ref(false);
const editedRole = ref<Role>({ id: '', name: '', description: '' });
const updatingRole = ref(false);


const fetchRoleDetail = async () => {
  const roleId = route.params.id as string;
  if (!roleId) {
    roleDetailError.value = new Error('Không tìm thấy ID vai trò trong URL.');
    showError('Lỗi: Không tìm thấy ID vai trò.');
    return;
  }

  roleDetailLoading.value = true;
  roleDetailError.value = null;
  selectedRoleDetail.value = null;

  try {
    const url = `${API_BASE}${ROLES_API_PATH}/${roleId}`;
    console.log('Fetching role detail from:', url);

    const { data: roleData, error, isLoading } = await get<Role>(url);

    roleDetailLoading.value = isLoading.value;

    if (error.value) {
      throw error.value;
    }

    if (roleData.value) {
      selectedRoleDetail.value = roleData.value;
    } else {
      roleDetailError.value = new Error('Không tìm thấy chi tiết vai trò.');
    }
  } catch (err: any) {
    roleDetailError.value = err instanceof Error ? err : new Error(err.message || 'Lỗi khi tải chi tiết vai trò.');
    showError(`Lỗi tải chi tiết: ${roleDetailError.value.message}`);
    console.error("Lỗi khi tải chi tiết vai trò:", err);
  } finally {
    roleDetailLoading.value = false;
  }
};


const goBack = () => {
  router.back();
};


const openEditRoleModal = () => {
  if (selectedRoleDetail.value) {

    editedRole.value = { ...selectedRoleDetail.value };
    showEditRoleModal.value = true;
  } else {
    showError('Không có dữ liệu vai trò để chỉnh sửa.');
  }
};


const closeEditRoleModal = () => {
  showEditRoleModal.value = false;
};


const updateRole = async () => {
  updatingRole.value = true;
  const roleId = editedRole.value.id;

  try {
    const url = `${API_BASE}${ROLES_API_PATH}/${roleId}`;
    console.log('Updating role with data:', editedRole.value);
    const { data: updatedRoleData, error } = await put<Role>(url, {
      name: editedRole.value.name,
      description: editedRole.value.description
    });

    if (error.value) {
      throw error.value;
    }

    if (updatedRoleData.value) {
      showSuccess(`Vai trò "${updatedRoleData.value.name}" đã được cập nhật thành công!`);
      closeEditRoleModal();
      await fetchRoleDetail();
    } else {
      showError('Không nhận được dữ liệu vai trò đã cập nhật từ máy chủ.');
    }
  } catch (error: any) {
    console.error("Lỗi khi cập nhật vai trò:", error);
    showError(`Lỗi cập nhật vai trò: ${error.message || 'Lỗi không xác định'}`);
  } finally {
    updatingRole.value = false;
  }
};

onMounted(() => {
  fetchRoleDetail();
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchRoleDetail();
  }
});
</script>

<style scoped>

</style>