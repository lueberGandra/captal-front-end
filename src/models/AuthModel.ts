export interface SignUpDto {
    email: string;
    password: string;
    name: string;
}

export interface SignInDto {
    email: string;
    password: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface ConfirmSignUpDto {
    email: string;
    code: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    email: string;
    code: string;
    newPassword: string;
}

export interface ResendVerificationDto {
    email: string;
}

export interface SignUpResponseDto {
    message: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export interface SignInResponseDto {
    data: {
        user: AuthUser;
        tokens: AuthTokens;
    };
}

export interface RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
} 
