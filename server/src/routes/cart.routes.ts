import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getCart);

router.post("/", protect, addToCart);

router.patch(
  "/items/:itemId",
  protect,
  updateCartItem
);

router.delete(
  "/items/:itemId",
  protect,
  removeCartItem
);

router.delete(
  "/",
  protect,
  clearCart
);

export default router;