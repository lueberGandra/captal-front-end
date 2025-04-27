import { useState, useEffect, useCallback } from 'react'
import { cookieService } from '../services/cookieService'
import { decodeToken } from '../utils/tokenUtils'
import { Project, ProjectStatus } from '../types/project'
import { projectService } from '../services/projectService'

export interface ProjectStats {
  total: number
  [ProjectStatus.PENDING]: number
  [ProjectStatus.APPROVED]: number
  [ProjectStatus.REJECTED]: number
  totalRevenue: number
}

const initialStats: ProjectStats = {
  total: 0,
  [ProjectStatus.PENDING]: 0,
  [ProjectStatus.APPROVED]: 0,
  [ProjectStatus.REJECTED]: 0,
  totalRevenue: 0
}

export function useHomeViewModel() {
  const [userName, setUserName] = useState('User')
  const [userRole, setUserRole] = useState<'developer' | 'admin' | ''>('')
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ProjectStats>(initialStats)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const idToken = cookieService.getCookie('idToken')
      if (idToken) {
        const decodedToken = decodeToken(idToken)
        setUserName(decodedToken.name || 'User')
        setUserRole(decodedToken['custom:role'] as 'developer' | 'admin' | '')
      }
    } catch (err) {
      console.error('Error decoding token:', err)
      setError('Erro ao carregar informações do usuário')
    }
  }, [])

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await projectService.getProjects()

      if (!response.data || !Array.isArray(response.data)) {
        setProjects([])
        setStats(initialStats)
        return
      }

      // Convert string values to numbers
      const projectsWithNumbers = response.data.map((project: Project) => ({
        ...project,
        landArea: parseFloat(project.landArea.toString()),
        estimatedCost: parseFloat(project.estimatedCost.toString()),
        expectedRevenue: parseFloat(project.expectedRevenue.toString())
      }))

      setProjects(projectsWithNumbers)

      // Calculate stats
      const projectStats = projectsWithNumbers.reduce<ProjectStats>((acc: ProjectStats, project: Project) => {
        acc.total++
        const status = project.status as ProjectStatus
        acc[status] = (acc[status] || 0) + 1
        if (status === ProjectStatus.APPROVED) {
          acc.totalRevenue += project.expectedRevenue
        }
        return acc
      }, { ...initialStats })

      setStats(projectStats)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Erro ao carregar projetos')
      setStats(initialStats)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userRole) {
      fetchProjects()
    }
  }, [userRole, fetchProjects])

  const formatCurrency = useCallback((value: number) => {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    } catch {
      return 'R$ 0,00'
    }
  }, [])

  const formatArea = useCallback((value: number) => {
    try {
      return `${value.toLocaleString('pt-BR')} m²`
    } catch {
      return '0 m²'
    }
  }, [])

  const getStatusColor = useCallback((status: ProjectStatus) => {
    const colors = {
      [ProjectStatus.PENDING]: 'text-yellow-600',
      [ProjectStatus.APPROVED]: 'text-green-600',
      [ProjectStatus.REJECTED]: 'text-red-600'
    }
    return colors[status] || 'text-gray-600'
  }, [])

  return {
    userName,
    userRole,
    projects,
    stats,
    isLoading,
    error,
    fetchProjects,
    formatCurrency,
    formatArea,
    getStatusColor
  }
}
