import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/authService";
import { useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordCardProps {
  onEmailSubmit: (email: string) => void;
}

export function ForgotPasswordCard({ onEmailSubmit }: ForgotPasswordCardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.sendRecoveryEmail({ email: data.email });
      onEmailSubmit(data.email);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao enviar email de recuperação");
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

      <h2 className="text-xl font-semibold mb-2">Esqueceu sua senha?</h2>
      <p className="text-sm text-gray-600 mb-6">
        Não se preocupe. Nós te enviaremos instruções.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Email
          </label>
          <Input
            type="email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-[#30448F] text-white hover:bg-[#30448F]/90"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar"}
        </Button>
      </form>

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
