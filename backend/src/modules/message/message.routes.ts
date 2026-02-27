import { Router } from "express";
import MessageController from "./message.controller";
import { validate } from "../../middlewares/validate.middleware";
import { sendMessageValidation } from "../../validations/schemas";

const messageRoutes = Router();

messageRoutes.get("/conversations", MessageController.getConversations);
messageRoutes.get("/partners", MessageController.getPartners);
messageRoutes.get("/conversations/:userId", MessageController.getThread);
messageRoutes.post("/", validate(sendMessageValidation), MessageController.sendMessage);

export default messageRoutes;
