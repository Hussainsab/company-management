import { ClientCompany } from "./company.model";
import { User } from "../user/user.model";
import { Profile } from "../profile/profile.model";
import { NotFoundError } from "../../errors/AppError";

export default class CompanyService {
    static async createCompany(data: { name: string; email?: string; phone?: string; address?: string; clientUserId: string }) {
        return await ClientCompany.create(data);
    }

    static async getCompanies(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const { rows, count } = await ClientCompany.findAndCountAll({
            include: [{ model: User, as: "clientUser", include: [{ model: Profile, as: "profile" }], attributes: { exclude: ["passwordHash"] } }],
            limit,
            offset,
            order: [["created_at", "DESC"]], // Ensure consistency with other paginated lists
        });

        return {
            companies: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        };
    }

    static async getCompany(id: string) {
        const company = await ClientCompany.findByPk(id, {
            include: [{ model: User, as: "clientUser", attributes: { exclude: ["passwordHash"] } }],
        });
        if (!company) throw new NotFoundError("Company not found");
        return company;
    }

    static async updateCompany(id: string, data: Partial<{ name: string; email: string; phone: string; address: string }>) {
        const company = await ClientCompany.findByPk(id);
        if (!company) throw new NotFoundError("Company not found");
        await company.update(data);
        return company;
    }

    static async deleteCompany(id: string) {
        const company = await ClientCompany.findByPk(id);
        if (!company) throw new NotFoundError("Company not found");
        await company.destroy();
        return { message: "Company deleted" };
    }
}
