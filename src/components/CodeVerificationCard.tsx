import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Clock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";

const passwordRegex = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

const codeVerificationSchema = z
  .object({
    code: z.string().min(1, "Código é obrigatório"),
    newPassword: z
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
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CodeVerificationFormData = z.infer<typeof codeVerificationSchema>;

interface CodeVerificationCardProps {
  email: string;
  onResendCode: () => void;
  onCodeVerified: () => void;
}

export function CodeVerificationCard({
  email,
  onResendCode,
  onCodeVerified,
}: CodeVerificationCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await authService.resendCode(email);
      onResendCode();
      setCountdown(30);
      setCanResend(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao reenviar código");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeVerificationFormData>({
    resolver: zodResolver(codeVerificationSchema),
  });

  const onSubmit = async (data: CodeVerificationFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.verifyCode({
        email,
        code: data.code,
        newPassword: data.newPassword,
      });
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao verificar código");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-[350px]">
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Captal</h1>
      </div>

      <h2 className="text-xl font-semibold mb-2 text-center">
        Recuperação de senha
      </h2>
      <p className="text-[14px] font-hind font-normal text-[#666666] mb-2">
        Nós enviamos um código para{" "}
        <span className="text-black font-semibold underline">{email}</span>
      </p>
      <p className="text-[14px] font-hind font-normal text-[#666666] mb-6">
        Sua senha deve possuir 8 caracteres, entre letras maiúsculas,
        minúsculas, caracteres especiais e números.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Código
          </label>
          <Input
            type="text"
            {...register("code")}
            className={errors.code ? "border-red-500" : ""}
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Nova Senha
          </label>
          <div className="relative">
            <Input
              type={showPasswords ? "text" : "password"}
              {...register("newPassword")}
              className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Confirmar Nova Senha
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

        <Button
          type="submit"
          className="w-full bg-[#30448F] text-white hover:bg-[#30448F]/90"
          disabled={isLoading}
        >
          {isLoading ? "Verificando..." : "Redefinir Senha"}
        </Button>
      </form>

      <div className="mt-4 text-center h-[20px]">
        <p className="text-sm text-gray-600">
          {canResend ? (
            <>
              Não recebeu?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                className="text-[#2B3C7F]"
              >
                Clique para reenviar.
              </button>
            </>
          ) : (
            <div className="text-[#666666] inline-flex items-center justify-center w-full gap-1">
              <span className="inline-flex items-center">
                <Clock size={16} className="text-[#666666]" />
              </span>
              <p className="mt-[1px] font-hind text-[12px] w-[22px]">{`0:${countdown
                .toString()
                .padStart(2, "0")}`}</p>
            </div>
          )}
        </p>
      </div>

      <div className="mt-3 text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBackToLogin}
          className="text-gray-600 inline-flex items-center w-full"
        >
          ← Voltar para Login
        </Button>
      </div>
    </div>
  );
}
