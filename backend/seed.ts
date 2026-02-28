import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./src/config/database";
import { User, UserRole } from "./src/modules/user/user.model";
import { Profile } from "./src/modules/profile/profile.model";
import bcrypt from "bcrypt";

async function seed() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        const adminEmail = process.env.ADMIN_EMAIL || "admin@hussain.dev";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

        const existing = await User.findOne({ where: { email: adminEmail } });
        if (!existing) {
            const hash = await bcrypt.hash(adminPassword, 10);
            const admin = await User.create({
                email: adminEmail,
                passwordHash: hash,
                role: UserRole.ADMIN,
                isActive: true,
            });
            await Profile.create({
                userId: admin.id,
                firstName: "Hussain",
                lastName: "Admin",
                phone: "",
            });
            console.log(`✅ Admin seeded: ${adminEmail} / ${adminPassword}`);
        } else {
            console.log(`ℹ️  Admin already exists: ${adminEmail}`);
        }
    } catch (error) {
        console.error("❌ Seed failed:", error);
    } finally {
        await sequelize.close();
    }
}

seed();
