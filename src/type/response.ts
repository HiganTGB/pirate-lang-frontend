import type {Ref} from "vue";

export interface PaginationData<T> {
    items: T[];
    total_items: number;
    total_pages: number;
    current_page: number;
    page_size: number;
}

export interface ServerResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface FieldError {
    field: string;
    message: string;
}

export interface ResponseError {
    status?: string;
    code: number;
    message: string;
    details?: FieldError[];
}

export interface LocalApiResponse<T> {
    data: Ref<T | null>;
    error: Ref<ResponseError | null>;
    isLoading: Ref<boolean>;
}
