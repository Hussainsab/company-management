import { Router } from "express";
import ProjectController from "./project.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
    createProjectValidation,
    updateProjectValidation,
    updateStatusValidation,
    assignEmployeeValidation,
} from "../../validations/schemas";

const projectRoutes = Router();

projectRoutes.get("/", ProjectController.getProjects);
projectRoutes.get("/:id", ProjectController.getProject);
projectRoutes.post("/", authorize("admin"), validate(createProjectValidation), ProjectController.createProject);
projectRoutes.put("/:id", authorize("admin"), validate(updateProjectValidation), ProjectController.updateProject);
projectRoutes.delete("/:id", authorize("admin"), ProjectController.deleteProject);
projectRoutes.patch("/:id/status", authorize("admin", "employee"), validate(updateStatusValidation), ProjectController.updateStatus);
projectRoutes.post("/:id/employees", authorize("admin"), validate(assignEmployeeValidation), ProjectController.assignEmployee);
projectRoutes.delete("/:id/employees/:userId", authorize("admin"), ProjectController.unassignEmployee);

export default projectRoutes;
