import express from "express";
import {
  registerNGO,
  loginNGO,
  getNGOProfile,
  updateNGOProfile,
  updateNGOProfileById,
  rateNGO,
  getAllNGOs
} from "../controllers/ngoController.js";

const router = express.Router();

// NGO routes
router.post("/register", registerNGO);
router.post("/login", loginNGO);
router.get("/profile/:id", getNGOProfile);
router.put("/profile", updateNGOProfile);
router.put("/profile/:id", updateNGOProfileById);
router.post("/rate/:id", rateNGO);
router.get("/", getAllNGOs);

export default router;