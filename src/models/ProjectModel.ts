import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    location: z.string().min(1, "Localização é obrigatória"),
    landArea: z.number({
        required_error: "Área é obrigatória",
        invalid_type_error: "Por favor, insira um número válido para a área",
    }).positive("Área deve ser maior que zero"),
    estimatedCost: z.number({
        required_error: "Custo estimado é obrigatório",
        invalid_type_error: "Por favor, insira um número válido para o custo estimado",
    }).positive("Custo estimado deve ser maior que zero"),
    expectedRevenue: z.number({
        required_error: "Receita esperada é obrigatória",
        invalid_type_error: "Por favor, insira um número válido para a receita esperada",
    }).positive("Receita esperada deve ser maior que zero"),
    description: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>; 
