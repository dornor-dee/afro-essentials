import dotenv from "dotenv";
import { DEFAULT_PORT } from "../constants";

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || DEFAULT_PORT,

  mongodbUri: process.env.MONGODB_URI as string,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  accessTokenExpires:
    process.env.ACCESS_TOKEN_EXPIRES || "15m",

  refreshTokenExpires:
    process.env.REFRESH_TOKEN_EXPIRES || "7d",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    apiSecret: process.env.CLOUDINARY_API_SECRET as string,
  },
};