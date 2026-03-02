import { create } from 'zustand';
import axios from 'axios';

const API_HEALTH_URL = (import.meta.env.VITE_API_URL || 'https://healthcare-auth-system.onrender.com/api') + '/health';

const useHealthStore = create((set) => ({
    status: 'UNKNOWN', // 'OK', 'DOWN', 'UNKNOWN'
    lastCheck: null,

    checkHealth: async () => {
        try {
            await axios.get(API_HEALTH_URL, { timeout: 5000 });
            set({ status: 'OK', lastCheck: new Date() });
        } catch (error) {
            set({ status: 'DOWN', lastCheck: new Date() });
        }
    }
}));

export default useHealthStore;
