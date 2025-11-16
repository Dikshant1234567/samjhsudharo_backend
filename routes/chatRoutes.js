import express from "express";
import { createOrGetChat, listChatsByUser, listMessages, sendMessage, markChatSeen } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", createOrGetChat);
router.get("/", listChatsByUser);
router.get("/:id/messages", listMessages);
router.post("/:id/messages", sendMessage);
router.patch("/:id/seen", markChatSeen);

export default router;