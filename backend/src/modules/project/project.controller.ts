import { Request, Response, NextFunction } from "express";
import ProjectService from "./project.service";

export default class ProjectController {
    static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const project = await ProjectService.createProject(req.body);
            res.status(201).json(project);
        } catch (error: any) { next(error); }
    }

    static async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, role } = (req as any).user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;
            res.json(await ProjectService.getProjects(userId, role, page, limit, status));
        } catch (error: any) { next(error); }
    }

    static async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ProjectService.getProject(req.params.id as string));
        } catch (error: any) { next(error); }
    }

    static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ProjectService.updateProject(req.params.id as string, req.body));
        } catch (error: any) { next(error); }
    }

    static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, role } = (req as any).user;
            const { status } = req.body;
            res.json(await ProjectService.updateStatus(req.params.id as string, status, userId, role));
        } catch (error: any) { next(error); }
    }

    static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ProjectService.deleteProject(req.params.id as string));
        } catch (error: any) { next(error); }
    }

    static async assignEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { employeeId } = req.body;
            res.json(await ProjectService.assignEmployee(req.params.id as string, employeeId));
        } catch (error: any) { next(error); }
    }

    static async unassignEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ProjectService.unassignEmployee(req.params.id as string, req.params.userId as string));
        } catch (error: any) { next(error); }
    }
}
