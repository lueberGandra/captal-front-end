import axios, { AxiosError } from "axios";
import { authService } from "@/services/authService";
import { cookieService } from "@/services/cookieService";

// Routes that should skip token refresh logic
const PUBLIC_ROUTES = [
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/confirm-signup',
    '/auth/resend-verification',
    '/auth/validate-reset-code'
];

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
    // Skip token logic for public routes
    if (config.url && PUBLIC_ROUTES.some(route => config.url?.includes(route))) {
        return config;
    }

    const token = cookieService.getCookie("accessToken");

    if (token) {
        // Se o token estiver expirado, tenta renovar
        if (cookieService.isTokenExpired()) {
            try {
                const refreshToken = cookieService.getCookie("refreshToken");
                if (!refreshToken) throw new Error("No refresh token available");

                const response = await authService.refreshToken({ refreshToken });
                cookieService.setAuthCookies({
                    AccessToken: response.accessToken,
                    RefreshToken: response.refreshToken,
                    IdToken: response.idToken,
                    TokenType: "Bearer",
                    ExpiresIn: response.expiresIn // 1 hour in seconds
                });

                config.headers.Authorization = `Bearer ${response.accessToken}`;
            } catch (error) {
                // Se falhar ao tentar refresh, limpa os cookies e redireciona para login
                cookieService.clearAllAuthCookies();
                window.location.href = "/login";
                return Promise.reject(error);
            }
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

// Interceptor para lidar com tokens expirados
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Skip refresh token logic for public routes
        if (originalRequest?.url && PUBLIC_ROUTES.some(route => originalRequest.url?.includes(route))) {
            return Promise.reject(error);
        }

        // Se o erro for 401 e não for uma tentativa de refresh
        if (error.response?.status === 401 && !originalRequest?.url?.includes('/auth/refresh-token')) {
            try {
                const refreshToken = cookieService.getCookie("refreshToken");
                if (!refreshToken) throw new Error("No refresh token available");

                const response = await authService.refreshToken({ refreshToken });
                cookieService.setAuthCookies({
                    AccessToken: response.accessToken,
                    RefreshToken: response.refreshToken,
                    IdToken: response.idToken,
                    TokenType: "Bearer",
                    ExpiresIn: 3600, // 1 hour in seconds
                });

                // Atualiza o header da requisição original com o novo token
                if (originalRequest?.headers) {
                    originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
                }

                // Repete a requisição original
                return api(originalRequest!);
            } catch (refreshError) {
                // Se falhar ao tentar refresh, limpa os cookies e redireciona para login
                cookieService.clearAllAuthCookies();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
); 
