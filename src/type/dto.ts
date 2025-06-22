
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
