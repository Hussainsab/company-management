import { Service } from "./service.model";
import { NotFoundError } from "../../errors/AppError";

export default class ServiceService {
    static async createService(data: { name: string; description?: string; price?: number }) {
        return await Service.create(data);
    }

    static async getServices() {
        return await Service.findAll();
    }

    static async getService(id: string) {
        const service = await Service.findByPk(id);
        if (!service) throw new NotFoundError("Service not found");
        return service;
    }

    static async updateService(id: string, data: Partial<{ name: string; description: string; price: number }>) {
        const service = await Service.findByPk(id);
        if (!service) throw new NotFoundError("Service not found");
        await service.update(data);
        return service;
    }

    static async deleteService(id: string) {
        const service = await Service.findByPk(id);
        if (!service) throw new NotFoundError("Service not found");
        await service.destroy();
        return { message: "Service deleted" };
    }
}
