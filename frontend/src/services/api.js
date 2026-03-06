import axios from 'axios';
import useAuthStore from '../store/authStore';
<<<<<<< HEAD

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
=======
import toast from 'react-hot-toast';

// 1) Update Frontend API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://healthcare-auth-system.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Enable credentials support for production 
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
    headers: {
        'Content-Type': 'application/json',
    },
});

<<<<<<< HEAD
=======
// Helper for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request Interceptor: Include JWT automatically
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
<<<<<<< HEAD
            config.headers.Authorization = `Bearer ${token}`;
=======
            config.headers.Authorization = `Bearer ${token}`; // Authorization header injection
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
        }
        return config;
    },
    (error) => Promise.reject(error)
);

<<<<<<< HEAD
=======
// Response Interceptor: Token refresh & Render Cold Start Handling
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

<<<<<<< HEAD
=======
        // 9) Render Free Tier Cold Start Handling
        // Handle network errors or server booting up (502, 503, 504)
        const isNetworkError = !error.response || [502, 503, 504].includes(error.response.status);
        if (isNetworkError && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            originalRequest._retryCount = 0;

            while (originalRequest._retryCount < 3) {
                originalRequest._retryCount++;
                toast.loading(`Waking secure server (Attempt ${originalRequest._retryCount}/3)...`, { id: 'cold-start' });
                await delay(3000 * originalRequest._retryCount); // Incremental backoff
                try {
                    const result = await api(originalRequest);
                    toast.success("Server active", { id: 'cold-start' });
                    return result;
                } catch {
                    if (originalRequest._retryCount >= 3) {
                        toast.error("Cluster delayed. Please refresh.", { id: 'cold-start' });
                    }
                }
            }
        }

        // 3) Token refresh handling on 401
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const store = useAuthStore.getState();
                const refreshToken = store.refreshToken;
                if (!refreshToken) throw new Error("No refresh token");

<<<<<<< HEAD
                const res = await axios.post('http://localhost:3000/api/auth/refresh', {
                    token: refreshToken
                });
=======
                // Use base axios to avoid interceptor recursion
                const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    token: refreshToken
                }, { withCredentials: true });
>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107

                const newAccessToken = res.data.data.accessToken;
                store.setLogin(store.user, newAccessToken, refreshToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
<<<<<<< HEAD
=======

>>>>>>> 3b5969d318a5ab0380d1a8d5df4c76d8197bf107
        return Promise.reject(error);
    }
);

export default api;
