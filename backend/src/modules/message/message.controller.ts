import { Request, Response, NextFunction } from "express";
import MessageService from "./message.service";

export default class MessageController {
    static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const senderId = (req as any).user?.userId;
            const message = await MessageService.sendMessage(senderId, req.body);
            res.status(201).json(message);
        } catch (error: any) { next(error); }
    }

    static async getConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            res.json(await MessageService.getConversations(userId));
        } catch (error: any) { next(error); }
    }

    static async getThread(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            res.json(await MessageService.getThread(userId, req.params.userId as string));
        } catch (error: any) { next(error); }
    }

    static async getPartners(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            const role = (req as any).user?.role;
            res.json(await MessageService.getPartners(userId, role));
        } catch (error: any) { next(error); }
    }
}
