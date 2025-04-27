import { useHomeViewModel } from "../viewmodels/useHomeViewModel";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { ProjectStatus } from "../types/project";
import Layout from "../components/Layout";

function Home() {
  const {
    userName,
    userRole,
    stats,
    isLoading,
    projects,
    error,
    formatCurrency,
    formatArea,
    getStatusColor,
  } = useHomeViewModel();

  const cards = [
    {
      title: "Total de Projetos",
      value: stats?.total ?? 0,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Projetos Pendentes",
      value: stats?.[ProjectStatus.PENDING] ?? 0,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Projetos Aprovados",
      value: stats?.[ProjectStatus.APPROVED] ?? 0,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Projetos Rejeitados",
      value: stats?.[ProjectStatus.REJECTED] ?? 0,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Receita Total Esperada",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  const getStatusIcon = (status: ProjectStatus): JSX.Element | null => {
    const statusIcons = {
      [ProjectStatus.PENDING]: (
        <Clock size={20} className={getStatusColor(status)} />
      ),
      [ProjectStatus.APPROVED]: (
        <CheckCircle2 size={20} className={getStatusColor(status)} />
      ),
      [ProjectStatus.REJECTED]: (
        <XCircle size={20} className={getStatusColor(status)} />
      ),
    };

    return statusIcons[status] || null;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-[#30448F]">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Olá {userName}!
          {userRole && (
            <span className="ml-2 text-sm text-gray-500 capitalize">
              ({userRole})
            </span>
          )}
        </h2>
        <p className="mt-2 text-gray-600">
          {userRole === "admin"
            ? "Aqui está o resumo de todos os projetos imobiliários."
            : "Aqui está o resumo dos seus projetos imobiliários."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">{card.title}</span>
              <card.icon className={`${card.color}`} size={20} />
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {userRole === "admin" ? "Todos os Projetos" : "Seus Projetos"}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Nome
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Localização
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Área
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Custo Est.
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Receita Est.
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {(projects ?? []).map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{project.name}</td>
                  <td className="py-3 px-4">{project.location}</td>
                  <td className="py-3 px-4">{formatArea(project.landArea)}</td>
                  <td className="py-3 px-4">
                    {formatCurrency(project.estimatedCost)}
                  </td>
                  <td className="py-3 px-4">
                    {formatCurrency(project.expectedRevenue)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <span
                        className={`capitalize ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status.toLowerCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {(projects ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Nenhum projeto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
