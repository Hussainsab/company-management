import { Router } from "express";
import CompanyController from "./company.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCompanyValidation, updateCompanyValidation } from "../../validations/schemas";

const companyRoutes = Router();

companyRoutes.get("/", CompanyController.getCompanies);
companyRoutes.get("/:id", CompanyController.getCompany);
companyRoutes.post("/", authorize("admin"), validate(createCompanyValidation), CompanyController.createCompany);
companyRoutes.put("/:id", authorize("admin"), validate(updateCompanyValidation), CompanyController.updateCompany);
companyRoutes.delete("/:id", authorize("admin"), CompanyController.deleteCompany);

export default companyRoutes;
