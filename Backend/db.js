import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

import { config } from "dotenv"
config()
import mongoose from "mongoose"

mongoose.connect(process.env.Mongo_Url)

const db = mongoose.connection

db.on("connected",()=>{
  console.log("MongoDB is connected");
})

db.on("error" ,(er)=>{
  console.log(`MongoDb error = ${er}`);
})

db.on("disconnected",()=>{
  console.log("Mongodb is Disconnected..");
})

export default db