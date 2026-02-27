import { ServiceRequest, ServiceRequestStatus } from "./service-request.model";
import { Project, ProjectStatus } from "../project/project.model";
import { User } from "../user/user.model";
import { Service } from "../service/service.model";
import { Profile } from "../profile/profile.model";
import { NotFoundError, BadRequestError } from "../../errors/AppError";

export default class ServiceRequestService {
    static async createRequest(clientId: string, createdById: string, data: { serviceId?: string | null; requestedProjectName?: string; requestedEmployeeCount?: number; customServiceName?: string | null; note?: string; projectId?: string }) {
        return await ServiceRequest.create({ clientId, createdById, ...data });
    }

    static async getRequests(userId: string, role: string, page: number = 1, limit: number = 10, status?: string) {
        const where: any = {};
        if (role === "client") where.clientId = userId;
        if (status) where.status = status;

        const offset = (page - 1) * limit;
        const { rows, count } = await ServiceRequest.findAndCountAll({
            where,
            include: [
                { model: User, as: "client", include: [{ model: Profile, as: "profile" }], attributes: { exclude: ["passwordHash"] } },
                { model: User, as: "creator", include: [{ model: Profile, as: "profile" }], attributes: { exclude: ["passwordHash"] } },
                { model: Service },
                { model: Project, as: "project" },
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            distinct: true
        });

        // Get total counts for stats cards
        const statsWhere: any = {};
        if (role === "client") statsWhere.clientId = userId;

        const [totalPending, totalApproved, totalRejected] = await Promise.all([
            ServiceRequest.count({ where: { ...statsWhere, status: "pending" } }),
            ServiceRequest.count({ where: { ...statsWhere, status: "approved" } }),
            ServiceRequest.count({ where: { ...statsWhere, status: "rejected" } }),
        ]);

        return {
            requests: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalPending,
            totalApproved,
            totalRejected
        };
    }

    static async approveRequest(id: string) {
        const request = await ServiceRequest.findByPk(id, {
            include: [{ model: User, as: "client" }, { model: Service }],
        });
        if (!request) throw new NotFoundError("Service request not found");
        if (request.status !== ServiceRequestStatus.PENDING) {
            throw new BadRequestError("Only pending requests can be approved");
        }

        await request.update({ status: ServiceRequestStatus.APPROVED });

        // Only create a new project if one wasn't already linked
        let project = null;
        if (!request.projectId) {
            const projectName = request.requestedProjectName || (request as any).service?.name || request.customServiceName || "New Project";

            project = await Project.create({
                name: `${projectName} — ${(request as any).client?.email}`,
                description: request.note || "Auto-created from service request",
                clientId: request.clientId,
                status: ProjectStatus.PLANNED,
            });

            // Note: We could use requestedEmployeeCount here if Project model had a capacity field, 
            // but for now we just store it in the request.
        }

        return { request, project };
    }

    static async rejectRequest(id: string) {
        const request = await ServiceRequest.findByPk(id);
        if (!request) throw new NotFoundError("Service request not found");
        if (request.status !== ServiceRequestStatus.PENDING) {
            throw new BadRequestError("Only pending requests can be rejected");
        }
        await request.update({ status: ServiceRequestStatus.REJECTED });
        return request;
    }
}
