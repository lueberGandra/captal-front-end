import { api } from '@/lib/axios';
import { Project, ProjectStatus } from '../types/project';

interface ApiResponse<T> {
    statusCode: number;
    timestamp: string;
    path: string;
    data: T;
}

interface ProjectStats {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    totalBudget: number;
    totalSpent: number;
    averageProgress: number;
}

export const projectService = {
    async getProjects(page: number = 1, limit: number = 10): Promise<ApiResponse<Project[]>> {
        const response = await api.get<ApiResponse<Project[]>>(`/projects?page=${page}&limit=${limit}`);
        return response.data;
    },

    async getProjectById(id: string): Promise<Project> {
        const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
        return response.data.data;
    },

    async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        const response = await api.post<ApiResponse<Project>>('/projects', project);
        return response.data.data;
    },

    async updateProject(id: string, project: Partial<Project>): Promise<Project> {
        const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, project);
        return response.data.data;
    },

    async deleteProject(id: string): Promise<void> {
        await api.delete(`/projects/${id}`);
    },

    async getProjectStats(): Promise<ProjectStats> {
        const response = await api.get<ApiResponse<ProjectStats>>('/projects/stats');
        return response.data.data;
    },

    async updateProjectStatus(id: string, status: ProjectStatus): Promise<Project> {
        const response = await api.patch<ApiResponse<Project>>(`/projects/${id}/status`, { status });
        return response.data.data;
    },

    async updateProjectProgress(id: string, progress: number): Promise<Project> {
        const response = await api.patch<ApiResponse<Project>>(`/projects/${id}/progress`, { progress });
        return response.data.data;
    }
}; 
