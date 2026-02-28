import { User, UserRole } from "./user.model";
import { Profile } from "../profile/profile.model";
import bcrypt from "bcrypt";
import { NotFoundError, ConflictError, BadRequestError } from "../../errors/AppError";

export default class UserService {
    static async createUser(
        email: string,
        password: string,
        role: UserRole,
        firstName?: string,
        lastName?: string,
        phone?: string
    ) {
        if (!email || !password) throw new BadRequestError("Email and password are required");

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new ConflictError("User with this email already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, passwordHash: hashedPassword, role });

        await Profile.create({ userId: user.id, firstName: firstName || "", lastName: lastName || "", phone: phone || "" });

        return await User.findByPk(user.id, {
            include: [{ model: Profile, as: "profile" }],
            attributes: { exclude: ["passwordHash"] },
        });
    }

    static async getUsers(role?: string, page: number = 1, limit: number = 10) {
        const where: any = {};
        if (role) where.role = role;

        const offset = (page - 1) * limit;

        const { rows, count } = await User.findAndCountAll({
            where,
            include: [{ model: Profile, as: "profile" }],
            attributes: { exclude: ["passwordHash"] },
            limit,
            offset,
            order: [["created_at", "DESC"]],
        });

        return {
            users: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        };
    }

    static async getUser(id: string) {
        const user = await User.findByPk(id, {
            include: [{ model: Profile, as: "profile" }],
            attributes: { exclude: ["passwordHash"] },
        });
        if (!user) throw new NotFoundError("User not found");
        return user;
    }

    static async deleteUser(id: string) {
        const user = await User.findByPk(id);
        if (!user) throw new NotFoundError("User not found");
        await user.destroy();
        return { message: "User deleted" };
    }

    static async updateUser(id: string, updates: { isActive?: boolean; role?: string }) {
        const user = await User.findByPk(id);
        if (!user) throw new NotFoundError("User not found");
        await user.update(updates);
        return user;
    }

    static async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string; avatar?: string }) {
        let profile = await Profile.findOne({ where: { userId } });
        if (!profile) {
            profile = await Profile.create({ userId, ...data });
        } else {
            await profile.update(data);
        }
        return profile;
    }
}