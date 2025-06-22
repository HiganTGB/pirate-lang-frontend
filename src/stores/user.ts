import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import {get, put, API_BASE_URL, postFormData,} from '../utils/api';
import type{ UserProfile,UpdateUserAvatarResponse } from '../type/dto'

// Định nghĩa interface cho State của User Store
interface UserState {
    userProfile: UserProfile | null;
}
// For Localhost
function convertMinioToLocalIfApplicable(url: string): string {
    const minioRegex = /^(http:\/\/|https:\/\/)?minio(:[0-9]+)?/;
    if (minioRegex.test(url)) {
        return url.replace(minioRegex, '$1localhost$2');
    }
    return url;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userProfile: null
    }),

    getters: {
        getUserProfile(state): UserProfile | null {
            return state.userProfile;
        },
        getInitials(state): string {
            if (!state.userProfile || !state.userProfile.full_name) return '';
            const parts = state.userProfile.full_name.split(' ');
            if (parts.length > 1) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return state.userProfile.full_name[0].toUpperCase();
        },
    },

    actions: {
        setUserProfile(profileData: Partial<Omit<UserProfile, 'birthday'>> & { birthday?: string | Date | null }) {
            const formattedProfile: UserProfile = {
                id: profileData.id || '',
                email :profileData.email || '',
                user_name:profileData.user_name ||'',
                full_name: profileData.full_name || '',
                gender: profileData.gender || '',
                birthday: null,
                phone_number: profileData.phone_number || '',
                address: profileData.address || '',
                avatar_url: profileData.avatar_url || '',
                bio: profileData.bio || '',
            };

            if (profileData.birthday) {
                if (profileData.birthday instanceof Date) {
                    formattedProfile.birthday = profileData.birthday;
                } else {
                    const date = new Date(profileData.birthday);
                    formattedProfile.birthday = isNaN(date.getTime()) ? null : date;
                }
            } else {
                formattedProfile.birthday = null;
            }
            this.userProfile = formattedProfile;
        },
        async fetchUserProfile() {
            try {
                const { data, error } = await get<UserProfile>(`${API_BASE_URL}/accounts/profile`);
                if (error.value) {
                    throw error;
                }

                if (data.value) {
                    const profile = data.value as UserProfile;
                    profile.avatar_url=convertMinioToLocalIfApplicable(profile.avatar_url)
                    this.setUserProfile(profile);
                    console.log('User profile loaded into Pinia store:', this.userProfile);
                }
            } catch (err: any) {
                console.error('Failed to fetch user profile:', err);
                throw err;
            }
        },
        async updateUserProfile(profileData: Partial<UserProfile>): Promise<boolean> {
            try {
                const dataToSend = {
                    ...profileData,
                    birthday: profileData.birthday instanceof Date ? profileData.birthday.toISOString() : profileData.birthday,
                };
                console.log('Sending update profile data:', dataToSend);

                const { data, error } = await put<UserProfile>(`${API_BASE_URL}/accounts/profile`, dataToSend);

                if (error.value) {
                    throw error.value;
                }
                if (data.value) {
                    await this.fetchUserProfile();
                }
                console.log('User profile updated successfully:', this.userProfile);
                return true;
            } catch (err: any) {
                console.error('Failed to update user profile:', err);
                throw err;
            }
        },
        async updateAvatar(file: File): Promise<string | null> {
            try {
                console.log(file);
                const formData = new FormData();
                formData.append('avatar', file);

                const { data, error } = await postFormData<UpdateUserAvatarResponse>(`${API_BASE_URL}/accounts/profile/avatar`,formData);
                if (error.value) {
                    throw error.value;
                }
                if (data.value) {
                    await this.fetchUserProfile();
                }

                const responseAvatar = data.value as UpdateUserAvatarResponse;
                const newAvatarUrl = convertMinioToLocalIfApplicable(responseAvatar.object_url);
                if (this.userProfile) {
                    this.userProfile.avatar_url = newAvatarUrl;
                } else {
                    await this.fetchUserProfile();
                }

                console.log('Avatar uploaded successfully:', newAvatarUrl);
                return newAvatarUrl;
            } catch (err: any) {
                console.error('Failed to upload avatar:', err);
                throw err;
            }
        },
        logout() {
            this.userProfile = null;
            useAuthStore().clearTokens();
            console.log('User logged out.');
        },
    },
});