import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const store = useAuthStore.getState();
                const refreshToken = store.refreshToken;
                if (!refreshToken) throw new Error("No refresh token");

                const res = await axios.post('http://localhost:3000/api/auth/refresh', {
                    token: refreshToken
                });

                const newAccessToken = res.data.data.accessToken;
                store.setLogin(store.user, newAccessToken, refreshToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
