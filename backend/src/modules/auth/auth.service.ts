import { User } from "../user/user.model";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default class AuthService {
    static async login(email: string, password: string) {
        const user = await User.findOne({ where: { email } })

        if (!user) {
            throw new Error("Invalid user")
        }

        const isMatch = bcrypt.compare(
            password,
            user.passwordHash
        )

        if (!isMatch) {
            throw new Error("Invalid credential")
        }

        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_SECRET, { expiresIn: "15000",  })

        return {token}
    }
}