const mongoose = require("mongoose")

// Connect to MongoDB
export async function connectDB(MONGO_URI) {
  await mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((_) => console.log("MongoDB Connected"))
    .catch((err) => console.warn(err))
}
