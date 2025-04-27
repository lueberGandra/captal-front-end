import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectStatus } from '../types/project';
import { projectService } from '../services/projectService';

interface ApiResponse<T> {
    statusCode: number;
    timestamp: string;
    path: string;
    data: T;
}

export function useProjectsViewModel() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await projectService.getProjects();
            setProjects(response.data || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Erro ao carregar projetos');
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = useCallback(async (data: {
        name: string;
        description: string;
        location: string;
        landArea: number;
        estimatedCost: number;
        expectedRevenue: number;
    }) => {
        try {
            const newProject = await projectService.createProject({
                ...data,
                status: ProjectStatus.PENDING
            });
            setProjects(prev => [...prev, newProject]);
            return newProject;
        } catch (err) {
            console.error('Error creating project:', err);
            throw err;
        }
    }, []);

    const updateProjectStatus = useCallback(async (projectId: string, status: ProjectStatus) => {
        try {
            const updatedProject = await projectService.updateProjectStatus(projectId, status);
            setProjects(prev => prev.map(project =>
                project.id === projectId ? updatedProject : project
            ));
            return updatedProject;
        } catch (err) {
            console.error('Error updating project status:', err);
            throw err;
        }
    }, []);

    const formatCurrency = useCallback((value: number) => {
        try {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        } catch {
            return 'R$ 0,00';
        }
    }, []);

    const formatArea = useCallback((value: number) => {
        try {
            return `${value.toLocaleString('pt-BR')} m²`;
        } catch {
            return '0 m²';
        }
    }, []);

    const getStatusColor = useCallback((status: ProjectStatus) => {
        const colors = {
            [ProjectStatus.PENDING]: 'text-yellow-600',
            [ProjectStatus.APPROVED]: 'text-green-600',
            [ProjectStatus.REJECTED]: 'text-red-600'
        };
        return colors[status] || 'text-gray-600';
    }, []);

    return {
        projects,
        isLoading,
        error,
        createProject,
        updateProjectStatus,
        formatCurrency,
        formatArea,
        getStatusColor
    };
} 
