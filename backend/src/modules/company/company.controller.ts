import { Request, Response, NextFunction } from "express";
import CompanyService from "./company.service";

export default class CompanyController {
    static async createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const company = await CompanyService.createCompany(req.body);
            res.status(201).json(company);
        } catch (error: any) {
            next(error);
        }
    }

    static async getCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await CompanyService.getCompanies(page, limit);
            res.json(result);
        } catch (error: any) {
            next(error);
        }
    }

    static async getCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const company = await CompanyService.getCompany(req.params.id as string);
            res.json(company);
        } catch (error: any) {
            next(error);
        }
    }

    static async updateCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const company = await CompanyService.updateCompany(req.params.id as string, req.body);
            res.json(company);
        } catch (error: any) {
            next(error);
        }
    }

    static async deleteCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await CompanyService.deleteCompany(req.params.id as string);
            res.json(result);
        } catch (error: any) {
            next(error);
        }
    }
}
