import express from "express";
import { registerGroup, getGroups } from "../controllers/groupUserController.js";

const router = express.Router();

router.post("/register", registerGroup);
router.get("/", getGroups);

export default router;
