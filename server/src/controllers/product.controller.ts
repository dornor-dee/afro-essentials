import { Request, Response } from "express";
import Product from "../models/Product";
import Category from "../models/Category";

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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
    const skip = (page - 1) * limit;

    const {
      search,
      category,
      brand,
      featured,
      bestSeller,
      newArrival,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (search) {
      const searchValue = String(search).trim();

      filter.$or = [
        { name: { $regex: searchValue, $options: "i" } },
        { description: { $regex: searchValue, $options: "i" } },
        { shortDescription: { $regex: searchValue, $options: "i" } },
        { brand: { $regex: searchValue, $options: "i" } },
        { tags: { $regex: searchValue, $options: "i" } },
      ];
    }

    if (category) {
  const categoryDocument = await Category.findOne({
    slug: String(category).toLowerCase(),
    isActive: true,
  }).select("_id");

  if (!categoryDocument) {
    return res.json({
      success: true,
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: page > 1,
      },
      products: [],
    });
  }

  filter.category = categoryDocument._id;
}

    if (brand) {
      filter.brand = {
        $regex: `^${String(brand).trim()}$`,
        $options: "i",
      };
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (bestSeller === "true") {
      filter.bestSeller = true;
    }

    if (newArrival === "true") {
      filter.newArrival = true;
    }

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};

      if (minPrice) {
        priceFilter.$gte = Number(minPrice);
      }

      if (maxPrice) {
        priceFilter.$lte = Number(maxPrice);
      }

      filter.price = priceFilter;
    }

    let sortOption: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    switch (sort) {
      case "price":
        sortOption = { price: 1 };
        break;

      case "-price":
        sortOption = { price: -1 };
        break;

      case "createdAt":
        sortOption = { createdAt: 1 };
        break;

      case "-createdAt":
        sortOption = { createdAt: -1 };
        break;

      case "name":
        sortOption = { name: 1 };
        break;

      case "-name":
        sortOption = { name: -1 };
        break;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getProductBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
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

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { slug, sku } = req.body;

    if (slug || sku) {
      const duplicateProduct = await Product.findOne({
        _id: { $ne: productId },
        $or: [
          ...(slug ? [{ slug }] : []),
          ...(sku ? [{ sku }] : []),
        ],
      });

      if (duplicateProduct) {
        return res.status(400).json({
          success: false,
          message: "Another product already uses this slug or SKU",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name slug");

    return res.json({
      success: true,
      message: "Product updated successfully",
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};