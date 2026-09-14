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
        "name slug price salePrice images thumbnail variants brand category isActive",
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
      variantId,
      quantity = 1,
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

    if (
      !variantId ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid variant ID is required",
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

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.find(
      (item) =>
        String(item._id) === String(variantId)
    );

    if (!variant || !variant.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    if (parsedQuantity > variant.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    const unitPrice =
      variant.salePrice ??
      variant.price ??
      product.salePrice ??
      product.price;

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        subtotal: 0,
        totalItems: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        String(item.product) === String(product._id) &&
        String(item.variant) === String(variant._id)
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + parsedQuantity;

      if (newQuantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: "Cart quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.unitPrice = unitPrice;
      existingItem.totalPrice =
        newQuantity * unitPrice;
    } else {
      cart.items.push({
        product: product._id,
        variant: variant._id,
        quantity: parsedQuantity,
        unitPrice,
        totalPrice: parsedQuantity * unitPrice,
      });
    }

    const totals = calculateCartTotals(cart.items);

    cart.subtotal = totals.subtotal;
    cart.totalItems = totals.totalItems;

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price salePrice images thumbnail variants brand category isActive",
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

export const updateCartItem = async (
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

    const itemId = String(req.params.itemId);
const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
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

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (cartItem) =>
        String(cartItem._id) === String(itemId)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product is no longer available",
      });
    }

    const variant = product.variants.find(
      (productVariant) =>
        String(productVariant._id) ===
        String(item.variant)
    );

    if (!variant || !variant.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product variant is no longer available",
      });
    }

    if (parsedQuantity > variant.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} item(s) available`,
      });
    }

    const unitPrice =
      variant.salePrice ??
      variant.price ??
      product.salePrice ??
      product.price;

    item.quantity = parsedQuantity;
    item.unitPrice = unitPrice;
    item.totalPrice =
      parsedQuantity * unitPrice;

    const totals = calculateCartTotals(cart.items);

    cart.subtotal = totals.subtotal;
    cart.totalItems = totals.totalItems;

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price salePrice images thumbnail variants brand category isActive",
    });

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update cart item",
    });
  }
};

export const removeCartItem = async (
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

    const itemId = String(req.params.itemId);

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        String(item._id) === String(itemId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items.splice(itemIndex, 1);

    const totals = calculateCartTotals(cart.items);

    cart.subtotal = totals.subtotal;
    cart.totalItems = totals.totalItems;

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price salePrice images thumbnail variants brand category isActive",
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove cart item",
    });
  }
};

export const clearCart = async (
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

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.totalItems = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to clear cart",
    });
  }
};