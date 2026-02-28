import { body, param } from "express-validator";

// Auth
export const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

// User
export const createUserValidation = [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("role")
        .isIn(["admin", "employee", "client"])
        .withMessage("Role must be admin, employee, or client"),
    body("firstName").optional().isString().trim().withMessage("First name must be a string"),
    body("lastName").optional().isString().trim().withMessage("Last name must be a string"),
    body("phone").optional().isMobilePhone("any").withMessage("Phone must be a valid number"),
];

export const updateProfileValidation = [
    body("firstName").optional().isString().trim().withMessage("First name must be a string"),
    body("lastName").optional().isString().trim().withMessage("Last name must be a string"),
    body("phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
    body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
];

// Company
export const createCompanyValidation = [
    body("name").notEmpty().withMessage("Company name is required").trim(),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
    body("clientUserId").isUUID().withMessage("clientUserId must be a valid UUID"),
];

export const updateCompanyValidation = [
    body("name").optional().notEmpty().withMessage("Company name cannot be empty").trim(),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
    param("id").isUUID().withMessage("Company ID must be a valid UUID"),
];

// Service
export const createServiceValidation = [
    body("name").notEmpty().withMessage("Service name is required").trim(),
    body("description").optional().isString().trim(),
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
];

export const updateServiceValidation = [
    body("name").optional().notEmpty().withMessage("Service name cannot be empty").trim(),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    param("id").isUUID().withMessage("Service ID must be a valid UUID"),
];

// Service Request / Project Proposal
export const createServiceRequestValidation = [
    body("serviceId").optional({ nullable: true }).custom(v => v === "" ? null : v).isUUID().withMessage("serviceId must be a valid UUID"),
    body("requestedProjectName").optional().isString().trim().withMessage("Project name must be a string"),
    body("requestedEmployeeCount").optional().isInt({ min: 1 }).withMessage("Employee count must be at least 1"),
    body("note").optional().isString().trim().withMessage("Note must be a string"),
    body("projectId").optional({ nullable: true }).custom(v => v === "" ? null : v).isUUID().withMessage("projectId must be a valid UUID"),
    body("clientId").optional({ nullable: true }).custom(v => v === "" ? null : v).isUUID().withMessage("clientId must be a valid UUID"),
];

// Project
export const createProjectValidation = [
    body("name").notEmpty().withMessage("Project name is required").trim(),
    body("description").optional().isString().trim(),
    body("clientId").isUUID().withMessage("clientId must be a valid UUID"),
    body("status")
        .optional()
        .isIn(["planned", "in_progress", "completed", "on_hold"])
        .withMessage("Invalid status value"),
];

export const updateProjectValidation = [
    body("name").optional().notEmpty().withMessage("Project name cannot be empty").trim(),
    body("status")
        .optional()
        .isIn(["planned", "in_progress", "completed", "on_hold"])
        .withMessage("Invalid status value"),
    param("id").isUUID().withMessage("Project ID must be a valid UUID"),
];

export const updateStatusValidation = [
    body("status")
        .notEmpty()
        .isIn(["planned", "in_progress", "completed", "on_hold"])
        .withMessage("Status must be one of: planned, in_progress, completed, on_hold"),
    param("id").isUUID().withMessage("Project ID must be a valid UUID"),
];

export const assignEmployeeValidation = [
    body("employeeId").isUUID().withMessage("employeeId must be a valid UUID"),
    param("id").isUUID().withMessage("Project ID must be a valid UUID"),
];

// Message
export const sendMessageValidation = [
    body("receiverId").isUUID().withMessage("receiverId must be a valid UUID"),
    body("content").notEmpty().withMessage("Message content is required").trim(),
];
