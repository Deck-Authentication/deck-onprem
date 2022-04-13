const mongoose = require("mongoose")

// Connect to MongoDB
export function connectDB(MONGO_URI) {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((_) => console.log("MongoDB Connected"))
    .catch((err) => console.warn(err))
}
