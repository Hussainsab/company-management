import { Request, Response, NextFunction } from "express";
import UserService from "./user.service";
import { UserRole } from "./user.model";
import { BadRequestError } from "../../errors/AppError";

export default class UserController {
    static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, role, firstName, lastName, phone } = req.body;
            if (!Object.values(UserRole).includes(role)) {
                next(new BadRequestError("Invalid role")); return;
            }
            const user = await UserService.createUser(email, password, role, firstName, lastName, phone);
            res.status(201).json(user);
        } catch (error: any) {
            next(error);
        }
    }

    static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { role, page, limit } = req.query;
            const users = await UserService.getUsers(
                role as string,
                page ? parseInt(page as string) : 1,
                limit ? parseInt(limit as string) : 10
            );
            res.json(users);
        } catch (error: any) {
            next(error);
        }
    }

    static async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserService.getUser(req.params.id as string);
            res.json(user);
        } catch (error: any) {
            next(error);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await UserService.deleteUser(req.params.id as string);
            res.json(result);
        } catch (error: any) {
            next(error);
        }
    }

    static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserService.updateUser(req.params.id as string, req.body);
            res.json(user);
        } catch (error: any) {
            next(error);
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            const profile = await UserService.updateProfile(userId, req.body);
            res.json(profile);
        } catch (error: any) {
            next(error);
        }
    }
}