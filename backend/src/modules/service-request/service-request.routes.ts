import { Router } from "express";
import ServiceRequestController from "./service-request.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createServiceRequestValidation } from "../../validations/schemas";

const serviceRequestRoutes = Router();

serviceRequestRoutes.get("/", ServiceRequestController.getRequests);
serviceRequestRoutes.post("/", authorize("client", "admin"), validate(createServiceRequestValidation), ServiceRequestController.createRequest);
serviceRequestRoutes.put("/:id/approve", authorize("admin"), ServiceRequestController.approveRequest);
serviceRequestRoutes.put("/:id/reject", authorize("admin"), ServiceRequestController.rejectRequest);

export default serviceRequestRoutes;
