<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <button @click="goBack" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Quay lại danh sách
      </button>

      <button
          v-if="selectedExamDetail"
          @click="openEditExamModal"
          class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
      >
        Chỉnh sửa Bài thi
      </button>
    </div>

    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Chi tiết Bài thi</h2>

    <div v-if="examDetailLoading" class="text-center text-lg text-blue-600 animate-pulse py-8">
      Đang tải chi tiết bài thi...
    </div>
    <div v-else-if="examDetailError" class="text-center text-lg text-red-600 py-8">
      Lỗi: {{ examDetailError.message || 'Không thể tải chi tiết bài thi.' }}
    </div>
    <div v-else-if="selectedExamDetail" class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl mx-auto space-y-4">
      <div class="pb-4 border-b border-gray-200">
        <p class="text-3xl font-bold text-gray-900">{{ selectedExamDetail.exam_title }}</p>
        <p class="text-gray-600 text-lg mt-1">{{ selectedExamDetail.exam_type }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><strong>ID Bài thi:</strong></div>
        <div class="text-gray-800 break-all">{{ selectedExamDetail.exam_id }}</div>

        <div><strong>Tiêu đề Bài thi:</strong></div>
        <div class="text-gray-800">{{ selectedExamDetail.exam_title }}</div>

        <div><strong>Thời lượng (phút):</strong></div>
        <div class="text-gray-800">{{ selectedExamDetail.duration_minutes }} phút</div>

        <div><strong>Loại Bài thi:</strong></div>
        <div class="text-gray-800">{{ selectedExamDetail.exam_type }}</div>

        <div><strong>Điểm Nghe tối đa:</strong></div>
        <div class="text-gray-800">{{ selectedExamDetail.max_listening_score }}</div>

        <div><strong>Điểm Đọc tối đa:</strong></div>
        <div class="text-gray-800">{{ selectedExamDetail.max_reading_score }}</div>

        <div><strong>Điểm Nói tối đa:</strong></div>
        <div class="text-gray-800">{{ selectedExamDetail.max_speaking_score }}</div>

        <div><strong>Điểm Viết tối đa:</strong></div>
        <div class="text-gray-800">{{ selectedExamDetail.max_writing_score }}</div>

        <div><strong>Tổng điểm:</strong></div>
        <div class="text-gray-800 font-semibold text-lg">{{ selectedExamDetail.total_score }}</div>

        <div><strong>Ngày tạo:</strong></div>
        <div class="text-gray-800">{{ new Date(selectedExamDetail.created_at).toLocaleString() }}</div>

        <div><strong>Cập nhật cuối:</strong></div>
        <div class="text-gray-800">{{ new Date(selectedExamDetail.updated_at).toLocaleString() }}</div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <strong>Mô tả:</strong>
        <p class="text-gray-800 mt-2 whitespace-pre-wrap">{{ selectedExamDetail.description || 'Chưa cập nhật' }}</p>
      </div>
    </div>
    <div v-else-if="!examDetailLoading" class="text-center text-lg text-gray-600 py-8">
      Không có chi tiết bài thi để hiển thị.
    </div>

    <div class="mt-8">
      <h3 class="text-2xl font-bold mb-4 text-gray-800 text-center">Các Phần của Bài thi</h3>
      <div v-if="examPartsLoading" class="text-center text-lg text-blue-600 animate-pulse py-4">
        Đang tải các phần thi...
      </div>
      <div v-else-if="examPartsError" class="text-center text-lg text-red-600 py-4">
        Lỗi: {{ examPartsError.message || 'Không thể tải các phần thi.' }}
      </div>
      <div v-else-if="examParts.length > 0">
        <ExamPart
            v-for="part in examParts"
            :key="part.part_order"
            :part="part"
        />
      </div>
      <div v-else class="text-center text-lg text-gray-600 py-4">
        Bài thi này chưa có phần nào.
      </div>
    </div>
    <div v-if="showEditExamModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h3 class="text-2xl font-bold mb-4 text-gray-800">Chỉnh sửa Bài thi</h3>
        <form @submit.prevent="updateExam">
          <div class="mb-4">
            <label for="editExamTitle" class="block text-gray-700 text-sm font-bold mb-2">Tiêu đề Bài thi:</label>
            <input
                type="text"
                id="editExamTitle"
                v-model="editedExam.exam_title"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-4">
            <label for="editExamDescription" class="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
            <textarea
                id="editExamDescription"
                v-model="editedExam.description"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="editDurationMinutes" class="block text-gray-700 text-sm font-bold mb-2">Thời lượng (phút):</label>
            <input
                type="number"
                id="editDurationMinutes"
                v-model.number="editedExam.duration_minutes"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-4">
            <label for="editExamType" class="block text-gray-700 text-sm font-bold mb-2">Loại Bài thi:</label>
            <input
                type="text"
                id="editExamType"
                v-model="editedExam.exam_type"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-4">
            <label for="editMaxListeningScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Nghe tối đa:</label>
            <input
                type="number"
                id="editMaxListeningScore"
                v-model.number="editedExam.max_listening_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="editMaxReadingScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Đọc tối đa:</label>
            <input
                type="number"
                id="editMaxReadingScore"
                v-model.number="editedExam.max_reading_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="editMaxSpeakingScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Nói tối đa:</label>
            <input
                type="number"
                id="editMaxSpeakingScore"
                v-model.number="editedExam.max_speaking_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="editMaxWritingScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Viết tối đa:</label>
            <input
                type="number"
                id="editMaxWritingScore"
                v-model.number="editedExam.max_writing_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="closeEditExamModal"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
                type="submit"
                :disabled="updatingExam"
                class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="updatingExam">Đang cập nhật...</span>
              <span v-else>Cập nhật Bài thi</span>
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
import ExamPart from "../../components/admin/ExamPart.vue";

import type{ Exam,ExamPartResponse } from '../../type/dto'



const EXAMS_API_PATH = '/admin/exams';
const EXAM_PARTS_API_PATH = '/admin/exam-parts';

const route = useRoute();
const router = useRouter();

const { showError, showSuccess } = useToast();

const selectedExamDetail = ref<Exam | null>(null);
const examDetailLoading = ref(false);
const examDetailError = ref<Error | null>(null);

const examParts = ref<ExamPartResponse[]>([]);
const examPartsLoading = ref(false);
const examPartsError = ref<Error | null>(null);

const showEditExamModal = ref(false);
const editedExam = ref<Exam>({
  exam_id: '',
  exam_title: '',
  description: '',
  duration_minutes: 0,
  exam_type: '',
  max_listening_score: 0,
  max_reading_score: 0,
  max_speaking_score: 0,
  max_writing_score: 0,
  total_score: 0,
  created_at: '',
  updated_at: '',
});
const updatingExam = ref(false);

const fetchExamDetail = async () => {
  const examId = route.params.id as string;
  if (!examId) {
    examDetailError.value = new Error('Không tìm thấy ID bài thi trong URL.');
    showError('Lỗi: Không tìm thấy ID bài thi.');
    return;
  }

  examDetailLoading.value = true;
  examDetailError.value = null;
  selectedExamDetail.value = null;

  try {
    const url = `${API_BASE}${EXAMS_API_PATH}/${examId}`;
    console.log('Fetching exam detail from:', url);

    const { data: examData, error, isLoading } = await get<Exam>(url);

    examDetailLoading.value = isLoading.value;

    if (error.value) {
      throw error.value;
    }

    if (examData.value) {
      selectedExamDetail.value = examData.value;
      await fetchExamParts(examId);
    } else {
      examDetailError.value = new Error('Không tìm thấy chi tiết bài thi.');
    }
  } catch (err: any) {
    examDetailError.value = err instanceof Error ? err : new Error(err.message || 'Lỗi khi tải chi tiết bài thi.');
    showError(`Lỗi tải chi tiết: ${examDetailError.value.message}`);
    console.error("Lỗi khi tải chi tiết bài thi:", err);
  } finally {
    examDetailLoading.value = false;
  }
};

const fetchExamParts = async (examId: string) => {
  examPartsLoading.value = true;
  examPartsError.value = null;
  examParts.value = [];

  try {
    const url = `${API_BASE}${EXAMS_API_PATH}/${examId}${EXAM_PARTS_API_PATH}`;
    console.log('Fetching exam parts from:', url);

    const { data: partsData, error, isLoading } = await get<ExamPartResponse[]>(url);

    examPartsLoading.value = isLoading.value;

    if (error.value) {
      throw error.value;
    }

    if (partsData.value) {
      examParts.value = partsData.value.sort((a, b) => a.part_order - b.part_order);
    } else {
      examPartsError.value = new Error('Không tìm thấy các phần thi.');
    }
  } catch (err: any) {
    examPartsError.value = err instanceof Error ? err : new Error(err.message || 'Lỗi khi tải các phần thi.');
    showError(`Lỗi tải phần thi: ${examPartsError.value.message}`);
    console.error("Lỗi khi tải các phần thi:", err);
  } finally {
    examPartsLoading.value = false;
  }
};

const goBack = () => {
  router.back();
};

const openEditExamModal = () => {
  if (selectedExamDetail.value) {
    editedExam.value = { ...selectedExamDetail.value };
    showEditExamModal.value = true;
  } else {
    showError('Không có dữ liệu bài thi để chỉnh sửa.');
  }
};

const closeEditExamModal = () => {
  showEditExamModal.value = false;
};

const updateExam = async () => {
  updatingExam.value = true;
  const examId = editedExam.value.exam_id;

  try {
    const url = `${API_BASE}${EXAMS_API_PATH}/${examId}`;
    console.log('Updating exam with data:', editedExam.value);

    const payload = {
      exam_title: editedExam.value.exam_title,
      description: editedExam.value.description,
      duration_minutes: editedExam.value.duration_minutes,
      exam_type: editedExam.value.exam_type,
      max_listening_score: editedExam.value.max_listening_score,
      max_reading_score: editedExam.value.max_reading_score,
      max_speaking_score: editedExam.value.max_speaking_score,
      max_writing_score: editedExam.value.max_writing_score,
    };

    const { data: updatedExamData, error } = await put<Exam>(url, payload);

    if (error.value) {
      throw error.value;
    }

    if (updatedExamData.value) {
      showSuccess(`Bài thi "${updatedExamData.value.exam_title}" đã được cập nhật thành công!`);
      closeEditExamModal();
      await fetchExamDetail();
    } else {
      showError('Không nhận được dữ liệu bài thi đã cập nhật từ máy chủ.');
    }
  } catch (error: any) {
    console.error("Lỗi khi cập nhật bài thi:", error);
    showError(`Lỗi cập nhật bài thi: ${error.message || 'Lỗi không xác định'}`);
  } finally {
    updatingExam.value = false;
  }
};

onMounted(() => {
  fetchExamDetail();
});

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchExamDetail();
  }
});
</script>

<style scoped>

</style>