import { defineStore } from 'pinia';
import { useAuthStore } from './auth';


export interface UserProfile {
    userId: string;
    fullName: string;
    birthday: Date | null;
    gender: string;
    phoneNumber: string;
    address: string;
    avatarUrl: string;
    bio: string;
}
interface UserState {
    userProfile: UserProfile | null;
}
function convertMinioToLocalIfApplicable(url: string): string {
    const minioRegex = /^(http:\/\/|https:\/\/)?minio(:[0-9]+)?/;

    if (minioRegex.test(url)) {
        return url.replace(minioRegex, '$1localhost$2');
    } else {
        return url;
    }
}
export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userProfile: null,
    }),
    getters: {
        getUserProfile(state): UserProfile | null {
            return state.userProfile;
        },
        getInitials(state): string {
            if (!state.userProfile || !state.userProfile.fullName) return '';
            const parts = state.userProfile.fullName.split(' ');
            if (parts.length > 1) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return state.userProfile.fullName[0].toUpperCase();
        },
    },
    actions: {
        setUserProfile(profileData: Partial<Omit<UserProfile, 'birthday'>> & { birthday?: string | Date | null }) {
            const formattedProfile: UserProfile = {
                userId: profileData.userId || '',
                fullName: profileData.fullName || '',
                gender: profileData.gender || '',
                birthday : null,
                phoneNumber: profileData.phoneNumber || '',
                address: profileData.address || '',
                avatarUrl: profileData.avatarUrl || '',
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
                const authStore = useAuthStore();
                const accessToken = authStore.getAccessToken;
                if (!accessToken) {
                    console.error('No access token available. Cannot fetch user profile.');
                    return;
                }

                const response = await fetch('http://localhost:9100/v1/accounts/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch user profile.');
                }

                const data = await response.json();
                console.log(data)
                const Data: UserProfile = {
                    userId: data.data.id,
                    fullName: data.data.full_name,
                    birthday: data.data.birthday,
                    gender: data.data.gender,
                    phoneNumber: data.data.phone_number,
                    address: data.data.address,
                    avatarUrl: convertMinioToLocalIfApplicable(data.data.avatar_url),
                    bio: data.data.bio
                };
                this.setUserProfile(Data);
                console.log('User profile loaded into Pinia store:', this.userProfile);
            } catch (error: any) {

            }
        },

        async updateUserProfile(profileData: Partial<UserProfile>) {
            try {
                const authStore = useAuthStore();
                const accessToken = authStore.getAccessToken;
                if (!accessToken) {
                    console.error('No access token available. Cannot update user profile.');
                    return;
                }

                const dataToSend = {
                    ...profileData,
                    birthday: profileData.birthday instanceof Date ? profileData.birthday.toISOString().split('T')[0] : profileData.birthday,
                };

                const response = await fetch('http://localhost:9100/v1/accounts/profile', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update user profile.');
                }

                const updatedData = await response.json();
                this.setUserProfile({
                    userId: updatedData.id,
                    fullName: updatedData.full_name,
                    birthday: updatedData.birthday,
                    gender: updatedData.gender,
                    phoneNumber: updatedData.phone_number,
                    address: updatedData.address,
                    avatarUrl: updatedData.avatar_url,
                    bio: updatedData.bio,
                });
                console.log('User profile updated successfully:', this.userProfile);
                return true;
            } catch (error) {
                console.error('Failed to update user profile:', error);
                return false;
            }
        },

        logout() {
            this.userProfile = null;
             useAuthStore().clearTokens();
            console.log('User logged out.');
        },
    },
});