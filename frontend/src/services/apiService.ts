import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    User, UserResponse,
    Project, ProjectResponse,
    ClientCompany, CompanyResponse,
    ServiceRequest, ServiceRequestResponse
} from '../types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User', 'Project', 'Company', 'ServiceRequest', 'Message'],
    endpoints: (builder) => ({
        // Users
        getUsers: builder.query<UserResponse, { page: number; limit: number; role?: string }>({
            query: (params) => ({
                url: '/users',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.users.map(({ id }) => ({ type: 'User' as const, id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),
        createUser: builder.mutation<User, Partial<User>>({
            query: (body) => ({
                url: '/users',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),

        // Companies
        getCompanies: builder.query<CompanyResponse, { page: number; limit: number }>({
            query: (params) => ({
                url: '/companies',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.companies.map(({ id }) => ({ type: 'Company' as const, id })),
                        { type: 'Company', id: 'LIST' },
                    ]
                    : [{ type: 'Company', id: 'LIST' }],
        }),
        createCompany: builder.mutation<ClientCompany, Partial<ClientCompany>>({
            query: (body) => ({
                url: '/companies',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Company', id: 'LIST' }],
        }),

        // Projects
        getProjects: builder.query<ProjectResponse, { page: number; limit: number; status?: string }>({
            query: (params) => ({
                url: '/projects',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.projects.map(({ id }) => ({ type: 'Project' as const, id })),
                        { type: 'Project', id: 'LIST' },
                    ]
                    : [{ type: 'Project', id: 'LIST' }],
        }),
        createProject: builder.mutation<Project, Partial<Project>>({
            query: (body) => ({
                url: '/projects',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Project', id: 'LIST' }],
        }),
        assignEmployees: builder.mutation<Project, { projectId: string; employeeId: string }>({
            query: ({ projectId, employeeId }) => ({
                url: `/projects/${projectId}/employees`,
                method: 'POST',
                body: { employeeId },
            }),
            invalidatesTags: (result, error, { projectId }) => [{ type: 'Project', id: projectId }],
        }),
        unassignEmployee: builder.mutation<Project, { projectId: string; employeeId: string }>({
            query: ({ projectId, employeeId }) => ({
                url: `/projects/${projectId}/employees/${employeeId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { projectId }) => [{ type: 'Project', id: projectId }],
        }),

        // Service Requests
        getRequests: builder.query<ServiceRequestResponse, { page: number; limit: number; status?: string }>({
            query: (params) => ({
                url: '/service-requests',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.requests.map(({ id }) => ({ type: 'ServiceRequest' as const, id })),
                        { type: 'ServiceRequest', id: 'LIST' },
                    ]
                    : [{ type: 'ServiceRequest', id: 'LIST' }],
        }),
        createRequest: builder.mutation<ServiceRequest, Partial<ServiceRequest>>({
            query: (body) => ({
                url: '/service-requests',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'ServiceRequest', id: 'LIST' }],
        }),
        updateRequestStatus: builder.mutation<ServiceRequest, { id: string; status: 'approve' | 'reject' }>({
            query: ({ id, status }) => ({
                url: `/service-requests/${id}/${status}`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'ServiceRequest', id }, { type: 'ServiceRequest', id: 'LIST' }],
        }),

        // Dashboard
        getDashboardStats: builder.query<any, void>({
            query: () => '/dashboard/stats',
            providesTags: [
                { type: 'Project', id: 'LIST' },
                { type: 'Company', id: 'LIST' },
                { type: 'User', id: 'LIST' },
                { type: 'ServiceRequest', id: 'LIST' }
            ],
        }),

        // Messages
        getConversations: builder.query<any[], void>({
            query: () => '/messages/conversations',
            providesTags: ['ServiceRequest'], // Just in case, though messages could have own tag
        }),
        getThread: builder.query<any[], string>({
            query: (partnerId) => `/messages/conversations/${partnerId}`,
            providesTags: (result, error, partnerId) => [
                { type: 'Message', id: partnerId },
            ],
        }),
        getMessagePartners: builder.query<User[], void>({
            query: () => '/messages/partners',
        }),
        sendMessage: builder.mutation<any, { receiverId: string; content: string }>({
            query: (body) => ({
                url: '/messages',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { receiverId }) => [
                { type: 'Message', id: receiverId },
            ],
        }),

        // Profile
        getUserById: builder.query<User, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        updateProfile: builder.mutation<User, { firstName: string; lastName: string; phone?: string }>({
            query: (body) => ({
                url: '/users/profile/me',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useGetCompaniesQuery,
    useCreateCompanyMutation,
    useGetProjectsQuery,
    useCreateProjectMutation,
    useAssignEmployeesMutation,
    useUnassignEmployeeMutation,
    useGetRequestsQuery,
    useCreateRequestMutation,
    useUpdateRequestStatusMutation,
    useGetDashboardStatsQuery,
    useGetConversationsQuery,
    useGetThreadQuery,
    useGetMessagePartnersQuery,
    useSendMessageMutation,
    useGetUserByIdQuery,
    useUpdateProfileMutation,
} = apiService;
