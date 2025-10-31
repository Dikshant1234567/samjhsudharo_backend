import express from "express";
import { registerIndividual, getIndividuals } from "../controllers/individualUserController.js";

const router = express.Router();

router.post("/register", registerIndividual);
router.get("/", getIndividuals);

export default router;
