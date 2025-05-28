
import { defineStore } from 'pinia';

export interface UserProfile {
    userId: string;
    fullName: string;
    birthday: Date | null;
    gender: string;
    phoneNumber: string;
    address: string;
    avatarUrl: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
}


interface UserState {
    userProfile: UserProfile | null;
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
        setUserProfile(profileData: Omit<UserProfile, 'birthday' | 'createdAt' | 'updatedAt'> & {
            birthday?: string | null;
            createdAt: string;
            updatedAt: string;
        }) {
            const formattedProfile: UserProfile = {
                ...profileData,
                birthday: profileData.birthday ? new Date(profileData.birthday) : null,
                createdAt: new Date(profileData.createdAt),
                updatedAt: new Date(profileData.updatedAt),
            };
            this.userProfile = formattedProfile;
        },

        async fetchUserProfile() {
            // TODO: fetch user
            try {
                const sampleData = {
                    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                    fullName: "Trần Gia Bảo",
                    birthday: "1990-01-15T00:00:00Z",
                    gender: "Male",
                    phoneNumber: "0987654321",
                    address: "Ho Chi Minh City",
                    avatarUrl: "https://i.pravatar.cc/150?img=68",
                    bio: "Software Engineer",
                    createdAt: "2023-01-01T10:00:00Z",
                    updatedAt: new Date().toISOString(),
                };

                this.setUserProfile(sampleData);
                console.log('User profile loaded into Pinia store:', this.userProfile);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        },

        logout() {
            this.userProfile = null;
            console.log('User logged out.');
        },
    },
});