import { Router } from "express";
import {
  getMe,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", logout);

export default router;