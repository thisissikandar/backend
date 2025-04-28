import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import { MONGODB_URI } from "../config/env.js";
import logger from "../logger/winston.logger.js";

/** @type {typeof mongoose | undefined} */
export let dbInstance = undefined;

const connectDB = async () => {
  console.log("MongoDB con ", `${MONGODB_URI}/${DB_NAME}`);
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    dbInstance = connectionInstance;
    logger.info(
      `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    logger.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
