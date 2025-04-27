import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";
import { SignUpVerificationCard } from "./SignUpVerificationCard";

const passwordRegex = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

const signUpPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(
        passwordRegex.lowercase,
        "A senha deve conter pelo menos 1 letra minúscula"
      )
      .regex(
        passwordRegex.uppercase,
        "A senha deve conter pelo menos 1 letra maiúscula"
      )
      .regex(passwordRegex.number, "A senha deve conter pelo menos 1 número")
      .regex(
        passwordRegex.special,
        "A senha deve conter pelo menos 1 caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpPasswordFormData = z.infer<typeof signUpPasswordSchema>;

export interface SignUpPasswordCardProps {
  formData: {
    name: string;
    email: string;
  };
  onBack: () => void;
}

export function SignUpPasswordCard({
  formData,
  onBack,
}: SignUpPasswordCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpPasswordFormData>({
    resolver: zodResolver(signUpPasswordSchema),
  });

  const onSubmit = async (data: SignUpPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.signUp({
        name: formData.name,
        email: formData.email,
        password: data.password,
      });

      // Show verification card instead of redirecting
      setShowVerification(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          setError("Este email já está em uso");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Ocorreu um erro ao criar sua conta. Tente novamente.");
        }
      } else {
        setError("Ocorreu um erro ao criar sua conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <SignUpVerificationCard
        email={formData.email}
        onBack={() => navigate("/login")}
      />
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Captal</h1>
      </div>

      <h2 className="text-xl font-semibold mb-2">Cadastro</h2>
      <p className="text-[14px] font-hind font-normal text-[#666666] mb-6">
        Sua senha deve possuir 8 caracteres, entre letras maiúsculas,
        minúsculas, caracteres especiais e números.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Senha
          </label>
          <div className="relative">
            <Input
              type={showPasswords ? "text" : "password"}
              {...register("password")}
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Confirmar Senha
          </label>
          <div className="relative">
            <Input
              type={showPasswords ? "text" : "password"}
              {...register("confirmPassword")}
              className={
                errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
              }
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-between items-center mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 inline-flex items-center"
          >
            ← Voltar
          </Button>
          <Button
            type="submit"
            className="bg-[#30448F] text-white px-8"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </div>
      </form>
    </div>
  );
}
