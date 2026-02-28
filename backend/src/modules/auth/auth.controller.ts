import { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";
import { BadRequestError } from "../../errors/AppError";

export default class AuthController {
    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.json(result);
        } catch (error: any) {
            next(error);
        }
    }

    static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) { next(new BadRequestError("Missing user context")); return; }
            const user = await AuthService.getMe(userId);
            res.json(user);
        } catch (error: any) {
            next(error);
        }
    }
}