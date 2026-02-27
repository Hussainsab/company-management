import { Project, ProjectStatus } from "./project.model";
import { ProjectEmployee } from "./project-employee.model";
import { User } from "../user/user.model";
import { Profile } from "../profile/profile.model";
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from "../../errors/AppError";

export default class ProjectService {
    static async createProject(data: { name: string; description?: string; clientId: string; status?: string }) {
        return await Project.create(data);
    }

    static async getProjects(userId: string, role: string, page: number = 1, limit: number = 10, status?: string) {
        const where: any = {};
        const include: any[] = [
            { model: User, as: "client", include: [{ model: Profile, as: "profile" }], attributes: { exclude: ["passwordHash"] } },
            { model: User, as: "employees", through: { attributes: [] }, include: [{ model: Profile, as: "profile" }], attributes: { exclude: ["passwordHash"] } },
        ];

        if (status) {
            where.status = status;
        }

        if (role === "client") {
            where.clientId = userId;
        } else if (role === "employee") {
            // Find all projects the employee is assigned to
            const assignments = await ProjectEmployee.findAll({
                where: { employeeId: userId },
                attributes: ['projectId']
            });
            const assignedProjectIds = assignments.map(a => a.projectId);

            where.id = {
                [require('sequelize').Op.in]: assignedProjectIds
            };
        }

        const offset = (page - 1) * limit;
        const { rows, count } = await Project.findAndCountAll({
            where,
            include,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            distinct: true // Required when using includes with limit/offset
        });

        return {
            projects: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        };
    }

    static async getProject(id: string) {
        const project = await Project.findByPk(id, {
            include: [
                { model: User, as: "client", include: [{ model: Profile, as: "profile" }], attributes: { exclude: ["passwordHash"] } },
                { model: User, as: "employees", through: { attributes: [] }, include: [{ model: Profile, as: "profile" }], attributes: { exclude: ["passwordHash"] } },
            ],
        });
        if (!project) throw new NotFoundError("Project not found");
        return project;
    }

    static async updateProject(id: string, data: Partial<{ name: string; description: string; status: string; clientId: string }>) {
        const project = await Project.findByPk(id);
        if (!project) throw new NotFoundError("Project not found");
        await project.update(data);
        return this.getProject(id);
    }

    static async updateStatus(id: string, status: string, userId: string, role: string) {
        const project = await Project.findByPk(id, {
            include: [{ model: User, as: "employees", through: { attributes: [] } }],
        });
        if (!project) throw new NotFoundError("Project not found");

        if (role === "employee") {
            const isAssigned = (project.employees as User[]).some((e: any) => e.id === userId);
            if (!isAssigned) throw new ForbiddenError("You are not assigned to this project");
        }

        await project.update({ status });
        return project;
    }

    static async deleteProject(id: string) {
        const project = await Project.findByPk(id);
        if (!project) throw new NotFoundError("Project not found");
        await project.destroy();
        return { message: "Project deleted" };
    }

    static async assignEmployee(projectId: string, employeeId: string) {
        const existing = await ProjectEmployee.findOne({ where: { projectId, employeeId } });
        if (existing) throw new ConflictError("Employee is already assigned to this project");
        await ProjectEmployee.create({ projectId, employeeId });
        return this.getProject(projectId);
    }

    static async unassignEmployee(projectId: string, employeeId: string) {
        const record = await ProjectEmployee.findOne({ where: { projectId, employeeId } });
        if (!record) throw new NotFoundError("Assignment not found");
        await record.destroy();
        return { message: "Employee unassigned" };
    }
}
