import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";

type UploadedImage = {
  url: string;
  publicId: string;
};

const uploadProductImageToCloudinary = (
  fileBuffer: Buffer
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "afro-essentials/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            error || new Error("Cloudinary product upload failed")
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

const uploadAvatarToCloudinary = (
  fileBuffer: Buffer
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "afro-essentials/avatars",
        resource_type: "image",
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "face",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            error || new Error("Cloudinary avatar upload failed")
          );
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

export const uploadProductImages = async (
  req: Request,
  res: Response
) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const images = await Promise.all(
      files.map((file) =>
        uploadProductImageToCloudinary(file.buffer)
      )
    );

    return res.status(200).json({
      success: true,
      images,
      thumbnail: images[0],
    });
  } catch (error) {
    console.error("Product image upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

export const uploadUserAvatar = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an avatar image",
      });
    }

    const oldPublicId = req.user.avatar?.publicId || "";

    const avatar = await uploadAvatarToCloudinary(file.buffer);

    const user = await User.findByIdAndUpdate(
  req.user._id,
  {
    $set: {
      avatar: {
        url: avatar.url,
        publicId: avatar.publicId,
      },
    },
  },
  {
    new: true,
    runValidators: true,
  }
).select("-password -refreshToken");

    if (!user) {
      await cloudinary.uploader.destroy(avatar.publicId);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(String(oldPublicId));
      } catch (deleteError) {
        console.error(
          "Old avatar deletion failed:",
          deleteError
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Avatar upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Avatar upload failed",
    });
  }
};