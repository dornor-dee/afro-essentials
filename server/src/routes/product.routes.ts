import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { protect, authorizeRoles } from "../middleware/auth.middleware";
import { USER_ROLES } from "../constants";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin routes
router.post(
  "/",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  deleteProduct
);

export default router;