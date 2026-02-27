import { Router } from "express";
import ServiceController from "./service.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createServiceValidation, updateServiceValidation } from "../../validations/schemas";

const serviceRoutes = Router();

serviceRoutes.get("/", ServiceController.getServices);
serviceRoutes.get("/:id", ServiceController.getService);
serviceRoutes.post("/", authorize("admin"), validate(createServiceValidation), ServiceController.createService);
serviceRoutes.put("/:id", authorize("admin"), validate(updateServiceValidation), ServiceController.updateService);
serviceRoutes.delete("/:id", authorize("admin"), ServiceController.deleteService);

export default serviceRoutes;
