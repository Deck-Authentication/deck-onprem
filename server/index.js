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
const { parse } = require("url")

app
  .prepare()
  .then(() => {
    const server = express()

    connectDB.call()

    server.use(async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        if (pathname === "/a") {
          await app.render(req, res, "/a", query)
        } else if (pathname === "/b") {
          await app.render(req, res, "/b", query)
        } else {
          await handle(req, res, parsedUrl)
        }
      } catch (err) {
        console.error("Error occurred handling", req.url, err)
        res.statusCode = 500
        res.end("internal server error")
      }
    })

    server.listen(PORT, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
