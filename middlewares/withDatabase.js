import { connectDB } from "../database"
import mongoose from "mongoose"

export default async function withDatabase(handler, MONGO_URI) {
  return async function (req, res) {
    // Only make the mongoDB connection if there's no active one.
    if (!mongoose.connections[0].readyState) await connectDB.call(MONGO_URI)
    return handler(req, res)
  }
}
