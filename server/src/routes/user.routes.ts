import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/user.controller";
import { uploadUserAvatar } from "../controllers/upload.controller";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/profile", protect, getProfile);

router.patch("/profile", protect, updateProfile);

router.patch(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadUserAvatar
);

router.patch("/change-password", protect, changePassword);

export default router;