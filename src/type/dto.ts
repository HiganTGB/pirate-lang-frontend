
export interface User {
    id: string;
    username: string;
    email: string;
    is_social_login: boolean;
    is_locked: boolean;
    created_at: string;
}
export interface LoginResponseData {
    access_token: string;
    refresh_token: string;
}


export interface UserProfile {
    id: string;
    email: string;
    user_name: string;
    full_name: string;
    birthday: string | Date | null;
    gender: string;
    phone_number: string;
    address: string;
    avatar_url: string;
    bio: string;
}
export interface UpdateUserAvatarResponse {
    original_filename: string;
    object_url: string;
}
export interface ExamPartResponse {
    part_title: string;
    part_order: number;
    description: string;
    is_practice_component: boolean;
    plan_type: string;
    created_at: string;
    updated_at: string;
    toeic_part_number: number;
}
export interface Exam {
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