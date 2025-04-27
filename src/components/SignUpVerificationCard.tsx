import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";

// Match the backend validation
const verificationSchema = z.object({
  code: z.string().length(6, "O código deve ter exatamente 6 caracteres"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface SignUpVerificationCardProps {
  email: string;
  onBack: () => void;
}

export function SignUpVerificationCard({
  email,
  onBack,
}: SignUpVerificationCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

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
      setError(null);
      await authService.resendVerification({ email });
      setCountdown(30);
      setCanResend(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.response?.status === 400) {
          setError("Usuário não encontrado ou já verificado");
        } else {
          setError("Erro ao reenviar código");
        }
      } else {
        setError("Erro ao reenviar código");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: VerificationFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.confirmSignUp({
        email,
        code: data.code,
      });
      navigate("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.response?.status === 400) {
          setError("Código inválido ou expirado");
        } else {
          setError("Erro ao verificar código");
        }
      } else {
        setError("Erro ao verificar código");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-[350px]">
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Captal</h1>
      </div>

      <h2 className="text-xl font-semibold mb-2">Código de verificação</h2>
      <p className="text-[14px] font-hind font-normal text-[#666666] mb-2">
        Enviamos em seu email um código de verificação. Para prosseguirmos,
        insira logo abaixo.
      </p>
      <p className="text-[14px] font-hind font-normal text-[#666666] mb-6">
        Nós enviamos um código para{" "}
        <span className="text-black font-semibold underline">{email}</span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Código de verificação
          </label>
          <Input
            type="text"
            {...register("code")}
            className={errors.code ? "border-red-500" : ""}
            placeholder="Digite o código de 6 dígitos"
            maxLength={6}
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-[#30448F] text-white hover:bg-[#30448F]/90"
          disabled={isLoading}
        >
          {isLoading ? "Verificando..." : "Enviar"}
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
              <p className="mt-[1px] font-hind text-[12px] w-[22px]">
                {`0:${countdown.toString().padStart(2, "0")}`}
              </p>
            </div>
          )}
        </p>
      </div>
    </div>
  );
}
