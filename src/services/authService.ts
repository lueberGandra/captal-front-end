import { api } from '@/lib/axios';
import {
    SignUpDto,
    SignInDto,
    RefreshTokenDto,
    ConfirmSignUpDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    ResendVerificationDto,
    SignUpResponseDto,
    SignInResponseDto,
    RefreshTokenResponseDto,
} from "@/models/AuthModel";

export const authService = {
    signUp: async (data: SignUpDto): Promise<SignUpResponseDto> => {
        const response = await api.post<SignUpResponseDto>('/auth/signup', data);
        return response.data;
    },

    signIn: async (data: SignInDto): Promise<SignInResponseDto> => {
        const response = await api.post<SignInResponseDto>('/auth/signin', data);
        return response.data;
    },

    refreshToken: async (data: RefreshTokenDto): Promise<RefreshTokenResponseDto> => {
        const response = await api.post<RefreshTokenResponseDto>('/auth/refresh-token', data);
        return response.data;
    },

    confirmSignUp: async (data: ConfirmSignUpDto): Promise<void> => {
        await api.post('/auth/confirm-signup', data);
    },

    forgotPassword: async (data: ForgotPasswordDto): Promise<void> => {
        await api.post('/auth/forgot-password', data);
    },

    resetPassword: async (data: ResetPasswordDto): Promise<void> => {
        const response = await api.post<void>('/auth/reset-password', data);
        return response.data;
    },

    resendVerification: async (data: ResendVerificationDto): Promise<void> => {
        await api.post('/auth/resend-verification', data);
    },

    // Remove these duplicate methods as they're already covered by the methods above
    sendRecoveryEmail: async (data: { email: string }): Promise<void> => {
        return authService.forgotPassword(data);
    },

    verifyCode: async (data: { email: string; code: string; newPassword: string }): Promise<void> => {
        return authService.resetPassword({
            email: data.email,
            code: data.code,
            newPassword: data.newPassword
        });
    },

    resendCode: async (email: string): Promise<void> => {
        return authService.resendVerification({ email });
    },
}; 
