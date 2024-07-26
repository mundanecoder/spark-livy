import mongoose, { Mongoose } from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const mongoUrl: string =
  process.env.MONGO_URL || "mongodb://localhost:27017/shoppers_den_db";

interface DbClient {
  connection: Mongoose;
}

const connectToDb = async (): Promise<DbClient | null> => {
  try {
    console.log("Connecting to database...");
    const connection = await mongoose.connect(mongoUrl);

    console.log("Connected to the database");

    return { connection };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return null;
  }
};

export default connectToDb;
