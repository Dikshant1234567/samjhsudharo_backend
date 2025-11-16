import express from "express";
import { createPostEvent, getPostEvents, getPostEventById } from "../controllers/postEventController.js";

const router = express.Router();

router.post("/", createPostEvent);
router.get("/", getPostEvents);
router.get("/:id", getPostEventById);

export default router;