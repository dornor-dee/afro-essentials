import { Request, Response } from "express";
import User from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { AuthRequest } from "../middleware/auth.middleware";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const userId = String(user._id);

    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      accessToken,
      refreshToken,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const userId = String(user._id);

    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId);

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user,
  });
};