import { connectDB } from "../database"

export default async function withDatabase(req, res) {
  return async function (handler) {
    connectDB(process.env.MONGO_URI)
    return handler(req, res)
  }
}
