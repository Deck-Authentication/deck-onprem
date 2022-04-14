import { connectDB } from "../database"
import mongoose from "mongoose"

export default async function handler(MONGO_URI) {
  if (!mongoose.connections[0].readyState) await connectDB(MONGO_URI)
}
