import { Router } from "express";
import {
  addToCart,
  getCart,
} from "../controllers/cart.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);

export default router;