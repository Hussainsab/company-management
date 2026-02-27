import { Router } from "express";
import { User, UserRole } from "../user/user.model";
import { Project, ProjectStatus } from "../project/project.model";
import { ProjectEmployee } from "../project/project-employee.model";
import { ServiceRequest, ServiceRequestStatus } from "../service-request/service-request.model";
import { Request, Response } from "express";
import { authorize } from "../../middlewares/authorize.middleware";

const dashboardRoutes = Router();

dashboardRoutes.get("/stats", async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const role = (req as any).user?.role;

        if (role === UserRole.ADMIN) {
            const [totalEmployees, totalClients, totalProjects, pendingRequests] = await Promise.all([
                User.count({ where: { role: UserRole.EMPLOYEE } }),
                User.count({ where: { role: UserRole.CLIENT } }),
                Project.count(),
                ServiceRequest.count({ where: { status: ServiceRequestStatus.PENDING } }),
            ]);

            const projectsByStatus = await Promise.all(
                Object.values(ProjectStatus).map(async (status) => ({
                    status,
                    count: await Project.count({ where: { status } }),
                }))
            );

            res.json({
                totalEmployees,
                totalClients,
                totalProjects,
                pendingRequests,
                projectsByStatus,
            });
        } else if (role === UserRole.EMPLOYEE) {
            const assignedProjects = await ProjectEmployee.count({ where: { employeeId: userId } });
            res.json({
                totalProjects: assignedProjects,
                activeProjects: assignedProjects, // Simplified for now
            });
        } else if (role === UserRole.CLIENT) {
            const clientProjects = await Project.count({ where: { clientId: userId } });
            const myRequests = await ServiceRequest.count({ where: { clientId: userId } });
            res.json({
                totalProjects: clientProjects,
                totalRequests: myRequests,
            });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default dashboardRoutes;
