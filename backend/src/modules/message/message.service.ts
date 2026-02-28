import { Message } from "./message.model";
import { User, UserRole } from "../user/user.model";
import { Profile } from "../profile/profile.model";
import { Project } from "../project/project.model";
import { ProjectEmployee } from "../project/project-employee.model";
import { Op } from "sequelize";

export default class MessageService {
    static async sendMessage(senderId: string, data: { receiverId: string; content: string }) {
        return await Message.create({ senderId, ...data });
    }

    static async getConversations(userId: string) {
        // Get unique conversation partners
        const sent = await Message.findAll({
            where: { senderId: userId },
            attributes: ["receiverId"],
            group: ["receiverId"],
        });
        const received = await Message.findAll({
            where: { receiverId: userId },
            attributes: ["senderId"],
            group: ["senderId"],
        });

        const partnerIds = new Set([
            ...sent.map((m) => m.receiverId),
            ...received.map((m) => m.senderId),
        ]);

        const partners = await User.findAll({
            where: { id: { [Op.in]: [...partnerIds] } },
            include: [{ model: Profile, as: "profile" }],
            attributes: { exclude: ["passwordHash"] },
        });

        // Get last message for each partner
        const conversations = await Promise.all(
            partners.map(async (partner) => {
                const lastMessage = await Message.findOne({
                    where: {
                        [Op.or]: [
                            { senderId: userId, receiverId: partner.id },
                            { senderId: partner.id, receiverId: userId },
                        ],
                    },
                    order: [["createdAt", "DESC"]],
                });
                return { partner, lastMessage };
            })
        );

        return conversations;
    }

    static async getThread(userId: string, otherId: string) {
        return await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId: otherId },
                    { senderId: otherId, receiverId: userId },
                ],
            },
            include: [
                {
                    model: User,
                    as: "sender",
                    include: [{ model: Profile, as: "profile" }],
                    attributes: { exclude: ["passwordHash"] },
                },
                {
                    model: User,
                    as: "receiver",
                    include: [{ model: Profile, as: "profile" }],
                    attributes: { exclude: ["passwordHash"] },
                },
            ],
            order: [["createdAt", "ASC"]],
        });
    }

    static async getPartners(userId: string, role: string) {
        let partnerIds = new Set<string>();

        // Everyone can see all admins
        const admins = await User.findAll({ where: { role: UserRole.ADMIN } });
        admins.forEach(a => partnerIds.add(a.id));

        if (role === UserRole.ADMIN) {
            // Admins can see everyone
            const allUsers = await User.findAll({ attributes: ['id'] });
            allUsers.forEach(u => partnerIds.add(u.id));
        } else if (role === UserRole.EMPLOYEE) {
            // Employees see partners in their projects
            const projectLinks = await ProjectEmployee.findAll({
                where: { employeeId: userId },
                include: [{
                    model: Project,
                    include: [
                        { model: User, as: 'client' },
                        { model: User, as: 'employees' }
                    ]
                }]
            });

            projectLinks.forEach((link: any) => {
                if (link.project?.client) partnerIds.add(link.project.clientId);
                link.project?.employees?.forEach((emp: any) => partnerIds.add(emp.id));
            });
        } else if (role === UserRole.CLIENT) {
            // Clients see employees in their projects
            const projects = await Project.findAll({
                where: { clientId: userId },
                include: [{ model: User, as: 'employees' }]
            });

            projects.forEach((p: any) => {
                p.employees?.forEach((emp: any) => partnerIds.add(emp.id));
            });
        }

        // Remove self
        partnerIds.delete(userId);

        return await User.findAll({
            where: { id: { [Op.in]: [...partnerIds] } },
            include: [{ model: Profile, as: "profile" }],
            attributes: { exclude: ["passwordHash"] },
        });
    }
}
