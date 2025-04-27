import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SignUpPasswordCard } from "./SignUpPasswordCard";

const signUpSchema = z.object({
  name: z.string().min(1, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpCard() {
  const navigate = useNavigate();
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    setFormData(data);
    setShowPasswordCard(true);
  };

  const handleBack = () => {
    if (showPasswordCard) {
      setShowPasswordCard(false);
    } else {
      navigate("/login");
    }
  };

  if (showPasswordCard && formData) {
    return (
      <SignUpPasswordCard
        formData={formData}
        onBack={() => setShowPasswordCard(false)}
      />
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Captal</h1>
      </div>
      <h2 className="text-xl font-semibold mb-2">Cadastro</h2>
      <p className="text-sm text-gray-600 mb-6">
        Não se preocupe. Nós te enviaremos instruções.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[14px] font-hind font-medium text-black">
            Nome completo
          </label>
          <Input
            type="text"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
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
        <div className="flex justify-between items-center mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            className="text-gray-600"
          >
            ← Voltar
          </Button>
          <Button type="submit" className="bg-[#30448F] text-white px-8">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
