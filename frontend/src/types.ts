export type UserRole = 'admin' | 'employee' | 'client';

export interface Profile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
}

export interface User {
    id: string;
    email: string;
    role: UserRole | string;
    isActive: boolean;
    profile?: Profile;
    name?: string;
}

export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'on_hold';

export interface Project {
    id: string;
    name: string;
    description?: string;
    clientId: string;
    status: ProjectStatus | string;
    client?: User;
    employees?: User[];
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClientCompany {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    clientUserId: string;
    clientUser?: User;
}

export interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
}

export type ServiceRequestStatus = 'pending' | 'approved' | 'rejected';

export interface ServiceRequest {
    id: string;
    clientId: string;
    serviceId: string | null;
    customServiceName?: string | null;
    projectId: string | null;
    createdById: string | null;
    requestedProjectName?: string | null;
    requestedEmployeeCount: number;
    status: ServiceRequestStatus | string;
    note: string;
    client?: User;
    service?: Service;
    project?: Project;
    creator?: User;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse {
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface ServiceRequestResponse extends PaginatedResponse {
    requests: ServiceRequest[];
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
}

export interface ProjectResponse extends PaginatedResponse {
    projects: Project[];
}

export interface CompanyResponse extends PaginatedResponse {
    companies: ClientCompany[];
}

export interface UserResponse extends PaginatedResponse {
    users: User[];
}
