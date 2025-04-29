import { useProjectsViewModel } from "../viewmodels/useProjectsViewModel";
import { Plus, Search, XCircle } from "lucide-react";
import { Project, ProjectStatus } from "../types/project";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProjectFormData,
  createProjectSchema,
} from "@/models/ProjectModel";

function Projects() {
  const {
    filteredProjects,
    isLoading,
    error,
    userRole,
    isCreateModalOpen,
    isDetailsModalOpen,
    selectedProject,
    searchTerm,
    statusFilter,
    createError,
    setSearchTerm,
    setStatusFilter,
    setIsCreateModalOpen,
    setIsDetailsModalOpen,
    setSelectedProject,
    createProject,
    updateProjectStatus,
    formatCurrency,
    formatArea,
    getStatusColor,
    getStatusIcon,
  } = useProjectsViewModel();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      location: "",
      landArea: undefined,
      estimatedCost: undefined,
      expectedRevenue: undefined,
      description: "",
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProject(data);
      reset();
    } catch (error) {
      // Error is handled by the view model
    }
  };

  const handleUpdateStatus = async (
    projectId: string,
    newStatus: ProjectStatus
  ) => {
    try {
      await updateProjectStatus(projectId, newStatus);
    } catch (error) {
      // Error is handled by the view model
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-theme(space.16))] flex items-center justify-center">
          <div className="text-[#30448F]">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
            <span>{error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Projetos</h2>
        <p className="mt-2 text-gray-600">
          Gerencie todos os projetos imobiliários.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 flex-1">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30448F] focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ProjectStatus | "all")
              }
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30448F] focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value={ProjectStatus.PENDING}>Pendente</option>
              <option value={ProjectStatus.APPROVED}>Aprovado</option>
              <option value={ProjectStatus.REJECTED}>Rejeitado</option>
            </select>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#30448F] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#30448F]/90 ml-4"
          >
            <Plus size={20} />
            Novo Projeto
          </button>
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
                {userRole === "admin" && (
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project: Project) => (
                <tr
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsDetailsModalOpen(true);
                  }}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
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
                      {(() => {
                        const Icon = getStatusIcon(project.status);
                        return (
                          <Icon
                            className={getStatusColor(project.status)}
                            size={20}
                          />
                        );
                      })()}
                      <span
                        className={`capitalize ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  {userRole === "admin" && (
                    <td
                      className="py-3 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        {project.status === ProjectStatus.PENDING && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  project.id,
                                  ProjectStatus.APPROVED
                                )
                              }
                              className="px-3 py-1.5 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  project.id,
                                  ProjectStatus.REJECTED
                                )
                              }
                              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Nenhum projeto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Novo Projeto</h2>
            {createError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {createError}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#30448F] focus:border-[#30448F]"
                  />
                  {errors.name && (
                    <span className="text-sm text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  <input
                    type="text"
                    {...register("location")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#30448F] focus:border-[#30448F]"
                  />
                  {errors.location && (
                    <span className="text-sm text-red-500">
                      {errors.location.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("landArea", { valueAsNumber: true })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#30448F] focus:border-[#30448F]"
                  />
                  {errors.landArea && (
                    <span className="text-sm text-red-500">
                      {errors.landArea.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Custo Estimado
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("estimatedCost", { valueAsNumber: true })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#30448F] focus:border-[#30448F]"
                  />
                  {errors.estimatedCost && (
                    <span className="text-sm text-red-500">
                      {errors.estimatedCost.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Receita Esperada
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("expectedRevenue", { valueAsNumber: true })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#30448F] focus:border-[#30448F]"
                  />
                  {errors.expectedRevenue && (
                    <span className="text-sm text-red-500">
                      {errors.expectedRevenue.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#30448F] focus:border-[#30448F]"
                  />
                  {errors.description && (
                    <span className="text-sm text-red-500">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#30448F] text-white rounded-md hover:bg-[#30448F]/90"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {isDetailsModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{selectedProject.name}</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Localização
                </h3>
                <p className="mt-1">{selectedProject.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Área</h3>
                <p className="mt-1">{formatArea(selectedProject.landArea)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Custo Estimado
                </h3>
                <p className="mt-1">
                  {formatCurrency(selectedProject.estimatedCost)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Receita Esperada
                </h3>
                <p className="mt-1">
                  {formatCurrency(selectedProject.expectedRevenue)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1 flex items-center gap-2">
                  {(() => {
                    const Icon = getStatusIcon(selectedProject.status);
                    return (
                      <Icon
                        className={getStatusColor(selectedProject.status)}
                        size={20}
                      />
                    );
                  })()}
                  <span
                    className={`capitalize ${getStatusColor(
                      selectedProject.status
                    )}`}
                  >
                    {selectedProject.status}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Data de Criação
                </h3>
                <p className="mt-1">
                  {new Date(selectedProject.createdAt).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                <p className="mt-1">
                  {selectedProject.description || "Sem descrição"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Projects;
