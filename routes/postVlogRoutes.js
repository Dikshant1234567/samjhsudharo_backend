import express from "express";
import { createPostVlog, getPostVlogs, getPostVlogById } from "../controllers/postVlogController.js";

const router = express.Router();

router.post("/", createPostVlog);
router.get("/", getPostVlogs);
router.get("/:id", getPostVlogById);

export default router;