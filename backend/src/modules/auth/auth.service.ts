import { User } from "../user/user.model";
import { Profile } from "../profile/profile.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NotFoundError, UnauthorizedError } from "../../errors/AppError";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default class AuthService {
    static async login(email: string, password: string) {
        const user = await User.findOne({
            where: { email },
            include: [{ model: Profile, as: "profile" }],
        });
        if (!user) throw new UnauthorizedError("Invalid credentials");
        if (!user.isActive) throw new UnauthorizedError("Account is deactivated");

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) throw new UnauthorizedError("Invalid credentials");

        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

        return {
            token,
            user: { id: user.id, email: user.email, role: user.role, profile: user.profile },
        };
    }

    static async getMe(userId: string) {
        const user = await User.findByPk(userId, {
            include: [{ model: Profile, as: "profile" }],
            attributes: { exclude: ["passwordHash"] },
        });
        if (!user) throw new NotFoundError("User not found");
        return user;
    }
}