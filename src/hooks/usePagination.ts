import { ref, computed, type Ref } from 'vue';

export interface PaginationResponse<T> {
    items: T[];
    total_items: number;
    total_pages: number;
    current_page: number;
    page_size: number;
}

export interface PaginationComposable {
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    totalItems: Ref<number>;
    totalPages: Ref<number>;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setTotalItems: (count: number) => void;
    resetPagination: () => void;
    updatePageSize: (size: number) => void;
}

export function usePagination(initialPage: number = 1, initialPageSize: number = 10): PaginationComposable {
    // Init Value
    const currentPage = ref(initialPage);
    const pageSize = ref(initialPageSize);
    const totalItems = ref(0);
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

    // Function
    const goToPage = (page: number) => {
        const targetPage = Math.max(1, Math.min(page, totalPages.value > 0 ? totalPages.value : 1));
        if (currentPage.value !== targetPage) {
            currentPage.value = targetPage;
        }
    };

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const setTotalItems = (count: number) => {
        totalItems.value = count;
        if (totalPages.value > 0 && currentPage.value > totalPages.value) {
            currentPage.value = totalPages.value;
        } else if (totalPages.value === 0 && currentPage.value !== 1) {
            currentPage.value = 1;
        }
    };

    const resetPagination = () => {
        currentPage.value = initialPage;
        pageSize.value = initialPageSize;
        totalItems.value = 0;
    };

    const updatePageSize = (size: number) => {
        if (pageSize.value !== size) {
            pageSize.value = size;
            goToPage(1);
        }
    };

    return {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        setTotalItems,
        resetPagination,
        updatePageSize,
    };
}