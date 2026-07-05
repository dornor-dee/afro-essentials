import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { protect, authorizeRoles } from "../middleware/auth.middleware";
import { USER_ROLES } from "../constants";

const router = Router();

// Public routes
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Products endpoint coming next...",
  });
});

// Admin routes
router.post(
  "/",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  createProduct
);

export default router;