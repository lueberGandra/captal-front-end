import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginViewModel } from "@/viewmodels/useLoginViewModel";
import { LoginFormData, loginSchema } from "@/models/LoginModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { cookieService } from "@/services/cookieService";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginCard() {
  const { login, isLoading, error } = useLoginViewModel();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      // Extract tokens from response.data.tokens
      const tokens = response.data.tokens;
      setAuth(tokens.accessToken);
      cookieService.setAuthCookies({
        AccessToken: tokens.accessToken,
        RefreshToken: tokens.refreshToken,
        IdToken: tokens.idToken,
        TokenType: "Bearer",
        ExpiresIn: tokens.expiresIn,
      });
      navigate("/");
    } catch (err) {
      // Error is already handled by useLoginViewModel
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-[350px] h-[520px]">
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Captal</h1>
      </div>

      <h2 className="text-center text-[14px] font-semibold mb-6 font-montserrat">
        Bem-vindo à plataforma de gestão de projetos imobiliários
      </h2>

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

        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Senha
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-[#30448F] text-white hover:bg-[#30448F]/90"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="w-full text-[14px] text-gray-600 font-hind font-normal bg-[#F4F4F5] h-[40px] rounded-md hover:bg-[#F4F4F5]/60"
          onClick={() => navigate("/sign-up")}
        >
          Cadastrar-me
        </button>
      </div>

      <div className="my-2 border-b border-gray-200"></div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-[#666666] font-hind"
        >
          Problemas com sua senha?
        </button>
      </div>
    </div>
  );
}
