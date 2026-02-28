import { Request, Response, NextFunction } from "express";
import ServiceService from "./service.service";

export default class ServiceController {
    static async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const service = await ServiceService.createService(req.body);
            res.status(201).json(service);
        } catch (error: any) { next(error); }
    }

    static async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ServiceService.getServices());
        } catch (error: any) { next(error); }
    }

    static async getService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ServiceService.getService(req.params.id as string));
        } catch (error: any) { next(error); }
    }

    static async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ServiceService.updateService(req.params.id as string, req.body));
        } catch (error: any) { next(error); }
    }

    static async deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(await ServiceService.deleteService(req.params.id as string));
        } catch (error: any) { next(error); }
    }
}
