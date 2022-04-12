const express = require("express")
const next = require("next")
const backendRouter = require("./routes/index.js")
/* It's loading the .env file and making the variables available to the rest of the application. */
require("dotenv").config({ path: `${process.cwd()}/.env.local` })
const PORT = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()
const { connectDB } = require("./routes/database")

app
  .prepare()
  .then(() => {
    const server = express()

    server.use("/api", backendRouter)

    server.get("*", (req, res) => {
      return handle(req, res)
    })

    connectDB.call()

    server.listen(PORT, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
