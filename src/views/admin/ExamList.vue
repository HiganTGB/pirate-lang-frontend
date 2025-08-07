<template>
  <div class="container mx-auto p-4">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Danh sách Bài thi</h2>

    <div class="mb-4 flex justify-end">
      <button
          @click="openCreateExamModal"
          class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Tạo Bài thi Mới
      </button>
    </div>

    <div v-if="loading" class="text-center text-lg text-blue-600 animate-pulse">
      Đang tải dữ liệu bài thi...
    </div>
    <div v-else-if="exams.length === 0 && !loading" class="text-center text-lg text-gray-600">
      Không tìm thấy bài thi nào.
    </div>
    <div v-else class="bg-white shadow-xl rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
        <tr class="bg-gray-100 border-b border-gray-200">
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            ID
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Tiêu đề Bài thi
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Mô tả
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Thời lượng (phút)
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Loại Bài thi
          </th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Tổng điểm
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="exam in exams"
            :key="exam.exam_id"
            class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            @click="viewExamDetail(exam.exam_id)" >
          <td class="px-5 py-3 text-sm text-gray-700 truncate max-w-[120px]">{{ exam.exam_id }}</td>
          <td class="px-5 py-3 text-sm text-gray-900 font-medium">{{ exam.exam_title }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ exam.description }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ exam.duration_minutes }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ exam.exam_type }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ exam.total_score }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showCreateExamModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <h3 class="text-2xl font-bold mb-4 text-gray-800">Tạo Bài thi Mới</h3>
        <form @submit.prevent="createExam">
          <div class="mb-4">
            <label for="examTitle" class="block text-gray-700 text-sm font-bold mb-2">Tiêu đề Bài thi:</label>
            <input
                type="text"
                id="examTitle"
                v-model="newExam.exam_title"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-4">
            <label for="examDescription" class="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
            <textarea
                id="examDescription"
                v-model="newExam.description"
                rows="4"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="durationMinutes" class="block text-gray-700 text-sm font-bold mb-2">Thời lượng (phút):</label>
            <input
                type="number"
                id="durationMinutes"
                v-model.number="newExam.duration_minutes"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-4">
            <label for="examType" class="block text-gray-700 text-sm font-bold mb-2">Loại Bài thi:</label>
            <input
                type="text"
                id="examType"
                v-model="newExam.exam_type"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
          </div>
          <div class="mb-4">
            <label for="maxListeningScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Nghe tối đa:</label>
            <input
                type="number"
                id="maxListeningScore"
                v-model.number="newExam.max_listening_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="maxReadingScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Đọc tối đa:</label>
            <input
                type="number"
                id="maxReadingScore"
                v-model.number="newExam.max_reading_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="maxSpeakingScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Nói tối đa:</label>
            <input
                type="number"
                id="maxSpeakingScore"
                v-model.number="newExam.max_speaking_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="maxWritingScore" class="block text-gray-700 text-sm font-bold mb-2">Điểm Viết tối đa:</label>
            <input
                type="number"
                id="maxWritingScore"
                v-model.number="newExam.max_writing_score"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="closeCreateExamModal"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
                type="submit"
                :disabled="creatingExam"
                class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="creatingExam">Đang tạo...</span>
              <span v-else>Tạo Bài thi</span>
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

interface Exam {
  exam_id: string;
  exam_title: string;
  description: string;
  duration_minutes: number;
  exam_type: string;
  max_listening_score: number;
  max_reading_score: number;
  max_speaking_score: number;
  max_writing_score: number;
  total_score: number;
  created_at: string;
  updated_at: string;
}

const EXAMS_API_PATH = '/admin/exams';

const exams: Ref<Exam[]> = ref([]);
const loading = ref(true);


const showCreateExamModal = ref(false);
const newExam = ref<Partial<Exam>>({
  exam_title: '',
  description: '',
  duration_minutes: 0,
  exam_type: '',
  max_listening_score: 0,
  max_reading_score: 0,
  max_speaking_score: 0,
  max_writing_score: 0,
});
const creatingExam = ref(false);


const fetchExams = async () => {
  loading.value = true;
  try {
    const url = `${API_BASE}${EXAMS_API_PATH}`;
    console.log('Fetching exams from:', url);

    const { data: responseData, error, isLoading } = await get<Exam[]>(url);

    loading.value = isLoading.value;

    if (error.value) {
      throw error.value;
    }

    if (responseData.value) {
      exams.value = responseData.value;
    } else {
      exams.value = [];
    }

  } catch (error: any) {
    console.error("Lỗi khi tải dữ liệu bài thi:", error);
    exams.value = [];
    loading.value = false;
    showError(`Lỗi tải danh sách bài thi: ${error.message || 'Lỗi không xác định'}`);
  }
};


const viewExamDetail = (examId: string) => {
  router.push({ name: 'ExamDetail', params: { id: examId } });
};


const openCreateExamModal = () => {
  newExam.value = {
    exam_title: '',
    description: '',
    duration_minutes: 0,
    exam_type: '',
    max_listening_score: 0,
    max_reading_score: 0,
    max_speaking_score: 0,
    max_writing_score: 0,
  };
  showCreateExamModal.value = true;
};


const closeCreateExamModal = () => {
  showCreateExamModal.value = false;
};


const createExam = async () => {
  creatingExam.value = true;
  try {
    const url = `${API_BASE}${EXAMS_API_PATH}`;
    console.log('Creating exam with data:', newExam.value);


    const payload = {
      exam_title: newExam.value.exam_title,
      description: newExam.value.description,
      duration_minutes: newExam.value.duration_minutes,
      exam_type: newExam.value.exam_type,
      max_listening_score: newExam.value.max_listening_score,
      max_reading_score: newExam.value.max_reading_score,
      max_speaking_score: newExam.value.max_speaking_score,
      max_writing_score: newExam.value.max_writing_score,
    };

    const { data: createdExam, error } = await post<Exam>(url, payload);

    if (error.value) {
      throw error.value;
    }

    if (createdExam.value) {
      showSuccess(`Bài thi "${createdExam.value.exam_title}" đã được tạo thành công!`);
      closeCreateExamModal();
      await fetchExams();
    } else {
      showError('Không nhận được dữ liệu bài thi đã tạo từ máy chủ.');
    }
  } catch (error: any) {
    console.error("Lỗi khi tạo bài thi:", error);
    showError(`Lỗi tạo bài thi: ${error.message || 'Lỗi không xác định'}`);
  } finally {
    creatingExam.value = false;
  }
};

onMounted(() => {
  fetchExams();
});
</script>

<style scoped>

</style>