import { z } from "zod";

export enum ForgotPasswordStep {
    EMAIL = 'EMAIL',
    CODE_VERIFICATION = 'CODE_VERIFICATION',
    NEW_PASSWORD = 'NEW_PASSWORD'
}

// Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
// Using the exact same regex as the backend: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W]{8,}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W]{8,}$/;

export const forgotPasswordSchema = z.object({
    email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z.object({
    email: z.string().email("Email inválido"),
    code: z.string().length(6, "O código deve ter exatamente 6 caracteres"),
    newPassword: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .regex(
            passwordRegex,
            "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
        ),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeRequest = z.infer<typeof resetPasswordSchema>;

export interface ForgotPasswordResponse {
    message: string;
} 
