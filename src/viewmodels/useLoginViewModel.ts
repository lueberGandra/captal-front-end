import { useState } from "react";
import { SignInDto, SignInResponseDto } from "@/models/AuthModel";
import { authService } from "@/services/authService";
import { cookieService } from "@/services/cookieService";
import { AxiosError } from "axios";

interface ApiError {
    statusCode: number;
    message: string;
}

export function useLoginViewModel() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: SignInDto): Promise<SignInResponseDto> => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.signIn(data);
            return response;
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data) {
                const apiError = err.response.data as ApiError;
                setError(apiError.message);
            } else {
                setError("Erro desconhecido ao fazer login");
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading,
        error,
    };
} 
