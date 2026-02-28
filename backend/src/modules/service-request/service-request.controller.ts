import { Request, Response, NextFunction } from "express";
import ServiceRequestService from "./service-request.service";

export default class ServiceRequestController {
    static async createRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, role } = (req as any).user;

            // Sanitize body: convert empty strings to null for UUID fields
            const data = { ...req.body };
            if (data.projectId === "") data.projectId = null;
            if (data.serviceId === "") data.serviceId = null;
            if (data.clientId === "") data.clientId = null;

            let clientId = userId;

            // admins can specify a clientId in the body to create a request for a client
            if (role === "admin" && data.clientId) {
                clientId = data.clientId;
            }

            const request = await ServiceRequestService.createRequest(clientId, userId, data);
            res.status(201).json(request);
        } catch (error: any) { next(error); }
    }

    static async getRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, role } = (req as any).user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;
            res.json(await ServiceRequestService.getRequests(userId, role, page, limit, status));
        } catch (error: any) { next(error); }
    }

    static async approveRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ServiceRequestService.approveRequest(req.params.id as string));
        } catch (error: any) { next(error); }
    }

    static async rejectRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ServiceRequestService.rejectRequest(req.params.id as string));
        } catch (error: any) { next(error); }
    }
}
