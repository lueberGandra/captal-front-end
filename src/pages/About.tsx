import Layout from "@/components/Layout";
import { InfoIcon, CheckCircle2 } from "lucide-react";

function About() {
  const features = [
    "Autenticação de usuários com diferentes perfis (Admin/Desenvolvedor)",
    "Gerenciamento de projetos imobiliários",
    "Dashboard com métricas e estatísticas em tempo real",
    "Sistema de aprovação de projetos",
    "Interface responsiva e moderna com Tailwind CSS",
  ];

  const futureFeatures = [
    "Paginação na listagem de projetos",
    "Upload e visualização de imagens dos projetos",
    "Filtros avançados de busca",
    "Exportação de relatórios",
  ];

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sobre o Captal
        </h1>
        <p className="text-gray-600 mb-6">
          O Captal é um sistema demonstrativo para gerenciamento de projetos
          imobiliários, desenvolvido com React, TypeScript e Node.js. O projeto
          foi criado para demonstrar boas práticas de desenvolvimento,
          arquitetura limpa e experiência do usuário.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Funcionalidades Implementadas
        </h2>
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <InfoIcon className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">
              Nota sobre Funcionalidades
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Por ser um projeto demonstrativo, algumas funcionalidades comuns em
            sistemas de produção não foram implementadas. Estas funcionalidades
            seriam incluídas em um ambiente de produção real.
          </p>
          <div className="space-y-2">
            {futureFeatures.map((feature, index) => (
              <div key={index} className="text-gray-600 ml-4">
                • {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Desenvolvido como projeto demonstrativo utilizando tecnologias
          modernas e boas práticas de desenvolvimento.
        </div>
      </div>
    </Layout>
  );
}

export default About;
