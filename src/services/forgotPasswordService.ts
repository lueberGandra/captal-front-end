import { api } from '@/lib/axios';
import {
    ForgotPasswordResponse,
} from "@/models/ForgotPasswordModel";

interface ResetPasswordResponse {
    message: string;
}

export const forgotPasswordService = {
    async sendResetPasswordEmail(email: string): Promise<ForgotPasswordResponse> {
        const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
        return response.data;
    },

    async resetPassword(
        email: string,
        code: string,
        newPassword: string
    ): Promise<ResetPasswordResponse> {
        const response = await api.post<ResetPasswordResponse>('/auth/reset-password', {
            email,
            code,
            newPassword,
        });
        return response.data;
    },

    async validateResetCode(
        email: string,
        code: string
    ): Promise<{ isValid: boolean }> {
        const response = await api.post<{ isValid: boolean }>('/auth/validate-reset-code', {
            email,
            code,
        });
        return response.data;
    },

    resendCode: async (email: string): Promise<ForgotPasswordResponse> => {
        const response = await api.post<ForgotPasswordResponse>(
            '/auth/resend-verification',
            { email }
        );
        return response.data;
    }
}; 
