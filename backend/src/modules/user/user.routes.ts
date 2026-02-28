import { Router } from "express";
import UserController from "./user.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createUserValidation, updateProfileValidation } from "../../validations/schemas";

const userRoutes = Router();

// Admin-only routes
userRoutes.post("/", authorize("admin"), validate(createUserValidation), UserController.createUser);
userRoutes.get("/", authorize("admin"), UserController.getUsers);
userRoutes.delete("/:id", authorize("admin"), UserController.deleteUser);
userRoutes.patch("/:id", authorize("admin"), UserController.updateUser);
userRoutes.get("/:id", UserController.getUser);

// Profile update (any authenticated user updates own profile)
userRoutes.put("/profile/me", validate(updateProfileValidation), UserController.updateProfile);

export default userRoutes;