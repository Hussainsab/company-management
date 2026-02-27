import { Router } from "express";
import AuthController from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { loginValidation } from "../../validations/schemas";

const authRouter = Router();

authRouter.post("/login", validate(loginValidation), AuthController.login);
authRouter.get("/me", authenticate, AuthController.getMe);

export default authRouter;