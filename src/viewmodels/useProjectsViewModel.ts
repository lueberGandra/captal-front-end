import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { Project, ProjectStatus } from '../types/project';
import { projectService } from '../services/projectService';
import { cookieService } from '../services/cookieService';
import { decodeToken } from '../utils/tokenUtils';
import { CreateProjectFormData } from '@/models/ProjectModel';
import { Plus, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function useProjectsViewModel() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<'developer' | 'admin' | ''>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const idToken = cookieService.getCookie('idToken');
            if (idToken) {
                const decodedToken = decodeToken(idToken);
                setUserRole(decodedToken['custom:role'] as 'developer' | 'admin' | '');
            }
        } catch (err) {
            console.error('Error decoding token:', err);
            setError('Erro ao carregar informações do usuário');
        }
    }, []);

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
        if (userRole) {
            fetchProjects();
        }
    }, [userRole, fetchProjects]);

    const createProject = useCallback(async (data: CreateProjectFormData) => {
        try {
            setCreateError(null);
            const projectData = {
                name: data.name,
                location: data.location,
                landArea: Number(data.landArea),
                estimatedCost: Number(data.estimatedCost),
                expectedRevenue: Number(data.expectedRevenue),
                description: data.description || "",
            };
            const newProject = await projectService.createProject(projectData);
            setProjects(prev => [...prev, newProject]);
            setIsCreateModalOpen(false);
            return newProject;
        } catch (err: any) {
            console.error('Error creating project:', err);
            setCreateError(err.response?.data?.message || "Erro ao criar projeto");
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

    const getStatusIcon = useCallback((status: ProjectStatus) => {
        const icons = {
            [ProjectStatus.PENDING]: Clock,
            [ProjectStatus.APPROVED]: CheckCircle2,
            [ProjectStatus.REJECTED]: XCircle,
        };
        return icons[status];
    }, []);

    const filteredProjects = projects.filter((project: Project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return {
        projects,
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
        getStatusIcon
    };
} 
