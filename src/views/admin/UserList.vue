<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Danh sách Người dùng</h2>

    <div v-if="loading" class="text-center text-lg text-blue-600 animate-pulse">
      Đang tải dữ liệu người dùng...
    </div>
    <div v-else-if="users.length === 0 && !loading" class="text-center text-lg text-gray-600">
      Không tìm thấy người dùng nào.
    </div>
    <div v-else class="bg-white shadow-xl rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
        <tr class="bg-gray-100 border-b border-gray-200">
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            ID
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Username
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Email
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Social Login
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Khóa
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Ngày tạo
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            @click="viewUserDetail(user.id)" >
          <td class="px-5 py-3 text-sm text-gray-700 truncate max-w-[120px]">{{ user.id }}</td>
          <td class="px-5 py-3 text-sm text-gray-900 font-medium">{{ user.username }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ user.email }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">
              <span :class="{'text-green-600': user.is_social_login, 'text-red-600': !user.is_social_login}">
                {{ user.is_social_login ? 'Có' : 'Không' }}
              </span>
          </td>
          <td class="px-5 py-3 text-sm text-gray-700">
              <span :class="{'text-red-600': user.is_locked, 'text-green-600': !user.is_locked}">
                {{ user.is_locked ? 'Có' : 'Không' }}
              </span>
          </td>
          <td class="px-5 py-3 text-sm text-gray-700">
            {{ formatDate(user.created_at) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>


    <PaginationControls
        v-if="!loading && (users.length > 0 || totalPages > 1)"
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-size="pageSize"
        :loading="loading"
        :page-size-options="[5, 10, 20, 30, 50]"
        @update:current-page="goToPage"
        @update:page-size="updatePageSize"
        @prev-page="prevPage"
        @next-page="nextPage"
        @go-to-page="goToPage"
    />
    <div v-else-if="!loading && users.length === 0" class="text-center text-sm text-gray-500 mt-4">
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePagination } from '../../hooks/usePagination.ts';
import PaginationControls from '../../components/PaginationControls.vue';

import {
  get,
  API_BASE_URL as API_BASE,
} from '../../utils/api.ts';
import {useToast} from "../../hooks/useToast.ts";
import type {PaginationData} from "../../type/response.ts";
import type {User} from "../../type/dto.ts";
const { showError } = useToast();

const router = useRouter();

const USERS_API_PATH = '/admin/users';

const {
  currentPage,
  pageSize,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
  setTotalItems,
  updatePageSize,
} = usePagination(1, 10);

const users: Ref<User[]> = ref([]);
const loading = ref(true);


const fetchUsers = async () => {
  try {
    const url = `${API_BASE}${USERS_API_PATH}?pageNumber=${currentPage.value}&pageSize=${pageSize.value}`;
    console.log('Fetching users from:', url);

    const { data: responseData, error, isLoading } = await get<PaginationData<User>>(url);

    loading.value = isLoading.value;

    if (error.value) {
      throw error.value;
    }

    if (responseData.value) {
      users.value = responseData.value.items;
      setTotalItems(responseData.value.total_items);
    } else {
      users.value = [];
      setTotalItems(0);
    }

  } catch (error: any) {
    console.error("Lỗi khi tải dữ liệu người dùng:", error);
    users.value = [];
    setTotalItems(0);
    loading.value = false;
    showError(`Lỗi tải danh sách người dùng: ${error.message || 'Lỗi không xác định'}`);
  }
};

const viewUserDetail = (userId: string) => {
  router.push({ name: 'UserDetail', params: { id: userId } });
};


const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  } catch (e) {
    console.error('Invalid date string:', dateString);
    return dateString;
  }
};

watch([currentPage, pageSize], () => {
  fetchUsers();
});

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>

</style>