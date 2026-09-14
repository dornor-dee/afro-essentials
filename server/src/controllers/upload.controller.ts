import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";

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
            error ||
              new Error("Cloudinary product upload failed")
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