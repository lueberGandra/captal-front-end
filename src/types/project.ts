export enum ProjectStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export interface Project {
    id: string;
    name: string;
    description: string;
    location: string;
    landArea: number;
    estimatedCost: number;
    expectedRevenue: number;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
} 
