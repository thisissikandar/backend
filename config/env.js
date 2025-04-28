import { config } from "dotenv";

config();

export const {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  JWT_SECRET
} = process.env;