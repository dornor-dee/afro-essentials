import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      sku,
      stock,
      category,
      brand,
      material,
      countryOfOrigin,
      images,
      thumbnail,
      colors,
      sizes,
      featured,
      bestSeller,
      newArrival,
      tags,
    } = req.body;

    const existingProduct = await Product.findOne({
      $or: [{ slug }, { sku }],
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      sku,
      stock,
      category,
      brand,
      material,
      countryOfOrigin,
      images,
      thumbnail,
      colors,
      sizes,
      featured,
      bestSeller,
      newArrival,
      tags,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};