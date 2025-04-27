// This file is deprecated. Please use AuthModel.ts instead.
// Keeping this file temporarily for backward compatibility.

import { z } from "zod";
import { SignInDto, SignInResponseDto } from "./AuthModel";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type LoginFormData = SignInDto;
export type LoginResponse = SignInResponseDto; 
