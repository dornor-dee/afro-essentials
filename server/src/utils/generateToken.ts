import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateAccessToken = (
  userId: string,
  role: string
): string => {
  return jwt.sign(
    { userId, role },
    env.jwtAccessSecret,
    {
      expiresIn: env.accessTokenExpires as jwt.SignOptions["expiresIn"],
    }
  );
};

export const generateRefreshToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    env.jwtRefreshSecret,
    {
      expiresIn: env.refreshTokenExpires as jwt.SignOptions["expiresIn"],
    }
  );
};