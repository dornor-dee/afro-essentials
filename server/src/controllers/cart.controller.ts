import { Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/auth.middleware";

const calculateCartTotals = (
  items: Array<{
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>
) => {
  let subtotal = 0;
  let totalItems = 0;

  for (const item of items) {
    item.totalPrice = item.quantity * item.unitPrice;
    subtotal += item.totalPrice;
    totalItems += item.quantity;
  }

  return {
    subtotal,
    totalItems,
  };
};

export const getCart = async (
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

    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      select:
        "name slug price images stock category brand isActive",
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        subtotal: 0,
        totalItems: 0,
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve cart",
    });
  }
};

export const addToCart = async (
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

    const {
      productId,
      quantity = 1,
      size = "",
      color = "",
    } = req.body;

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid product ID is required",
      });
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await Product.findById(productId);

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      typeof product.stock === "number" &&
      parsedQuantity > product.stock
    ) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const normalizedSize = String(size).trim().toLowerCase();
    const normalizedColor = String(color)
      .trim()
      .toLowerCase();

    const existingItem = cart.items.find(
      (item) =>
        String(item.product) === String(product._id) &&
        (item.variant?.size || "").toLowerCase() ===
          normalizedSize &&
        (item.variant?.color || "").toLowerCase() ===
          normalizedColor
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + parsedQuantity;

      if (
        typeof product.stock === "number" &&
        newQuantity > product.stock
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cart quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.unitPrice = product.price;
      existingItem.totalPrice =
        newQuantity * product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: parsedQuantity,
        variant: {
          size: String(size).trim(),
          color: String(color).trim(),
        },
        unitPrice: product.price,
        totalPrice: parsedQuantity * product.price,
      });
    }

    const totals = calculateCartTotals(cart.items);

    cart.subtotal = totals.subtotal;
    cart.totalItems = totals.totalItems;

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price images stock category brand isActive",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
    });
  }
};