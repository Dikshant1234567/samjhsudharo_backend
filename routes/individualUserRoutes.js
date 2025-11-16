import express from "express";
import { registerIndividual, getIndividuals, getProfile, updateProfile } from "../controllers/individualUserController.js";
import { loginIndividual } from "../controllers/individualUserController.js";
const router = express.Router();

router.post("/register", registerIndividual);
router.get("/", getIndividuals);
router.post("/login", loginIndividual);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);

export default router;
