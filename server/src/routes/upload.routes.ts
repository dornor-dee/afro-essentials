import { Router } from "express";
import {
  uploadProductImages,
} from "../controllers/upload.controller";
import {
  protect,
  authorizeRoles,
} from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { USER_ROLES } from "../constants";

const router = Router();

router.post(
  "/products",
  protect,
  authorizeRoles(USER_ROLES.ADMIN),
  upload.array("images", 5),
  uploadProductImages
);

export default router;