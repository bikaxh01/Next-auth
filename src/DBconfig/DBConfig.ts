import { log } from "console";
import mongoose from "mongoose";

//DB connection function
export async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    const connection = await mongoose.connection;

    connection.on("connected", () => {
      console.log(" Successfully Connected to DB");
    });

    connection.on("error", (error) => {
      console.log("Error while connecting", error);
      process.exit();
    });
  } catch (error) {
    console.log("Error while connecting to DB");
    console.log(error);
  }
}
