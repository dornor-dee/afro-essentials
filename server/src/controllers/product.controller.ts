import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      sku,
      category,
      brand,
      material,
      countryOfOrigin,
      images,
      thumbnail,
      variants,
      featured,
      bestSeller,
      newArrival,
      tags,
    } = req.body;

    if (
      !name ||
      !slug ||
      !description ||
      price === undefined ||
      !sku ||
      !category ||
      !brand ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required product fields",
      });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product variant is required",
      });
    }

    const existingProduct = await Product.findOne({
      $or: [{ slug }, { sku }],
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug or SKU already exists",
      });
    }

    const variantSkus = variants.map((variant: any) =>
      String(variant.sku || "")
        .trim()
        .toUpperCase()
    );

    if (variantSkus.some((variantSku: string) => !variantSku)) {
      return res.status(400).json({
        success: false,
        message: "Every product variant must have a SKU",
      });
    }

    if (new Set(variantSkus).size !== variantSkus.length) {
      return res.status(400).json({
        success: false,
        message: "Variant SKUs must be unique within the product",
      });
    }

    const existingVariantSku = await Product.findOne({
      "variants.sku": {
        $in: variantSkus,
      },
    });

    if (existingVariantSku) {
      return res.status(400).json({
        success: false,
        message: "One or more variant SKUs already exist",
      });
    }

    const invalidVariant = variants.some((variant: any) => {
      const stock = Number(variant.stock);

      return (
        !variant.sku ||
        Number.isNaN(stock) ||
        stock < 0 ||
        !Number.isInteger(stock)
      );
    });

    if (invalidVariant) {
      return res.status(400).json({
        success: false,
        message:
          "Each variant must have a valid SKU and non-negative integer stock",
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
      category,
      brand,
      material,
      countryOfOrigin,
      images,
      thumbnail,
      variants,
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
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
};

export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search,
      category,
      brand,
      featured,
      bestSeller,
      newArrival,
      minPrice,
      maxPrice,
      sort = "newest",
      page = "1",
      limit = "12",
    } = req.query;

    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: String(search),
            $options: "i",
          },
        },
        {
          description: {
            $regex: String(search),
            $options: "i",
          },
        },
        {
          tags: {
            $regex: String(search),
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = {
        $regex: `^${String(brand)}$`,
        $options: "i",
      };
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (bestSeller !== undefined) {
      filter.bestSeller = bestSeller === "true";
    }

    if (newArrival !== undefined) {
      filter.newArrival = newArrival === "true";
    }

    if (minPrice || maxPrice) {
      const priceFilter: {
        $gte?: number;
        $lte?: number;
      } = {};

      if (minPrice) {
        priceFilter.$gte = Number(minPrice);
      }

      if (maxPrice) {
        priceFilter.$lte = Number(maxPrice);
      }

      filter.price = priceFilter;
    }

    const sortOptions: Record<string, 1 | -1> = {};

    switch (sort) {
      case "price-low":
        sortOptions.price = 1;
        break;

      case "price-high":
        sortOptions.price = -1;
        break;

      case "oldest":
        sortOptions.createdAt = 1;
        break;

      case "name":
        sortOptions.name = 1;
        break;

      default:
        sortOptions.createdAt = -1;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(Number(limit) || 12, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber),

      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages: Math.ceil(
          totalProducts / limitNumber
        ),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve products",
    });
  }
};