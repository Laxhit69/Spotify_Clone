import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
    isAdmin: boolean,
    isLoading: boolean,
    error: string | null,

    checkAdminStatus: () => Promise<void>,
    reset: () => void,
}

export const useAuthStore = create<AuthStore>((set) => ({
    isLoading: false,
    isAdmin: false,
    error: null,
    checkAdminStatus: async () => {
        set({isLoading: true, error: null})
        try {
            const response = await axiosInstance.get('/admin/check');
            console.log('API response from check admin', response.data);
            set({isAdmin: response.data.admin});
        } catch (error : any) {
            set({isAdmin: false, error: error.response?.data?.message || 'Something went wrong' } )
        } finally {
            set({isLoading: false})
        }
    },
    reset: () => {
        set({isAdmin: false, isLoading: false, error: null})
    }

}))