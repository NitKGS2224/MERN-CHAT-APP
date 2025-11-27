import mongoose from "mongoose";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

//function ro connect to th mongo db  

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}`)
  }
  catch (error) {
    console.log(error);
  }
}
