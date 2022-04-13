const express = require("express")
const app = require("express").Router()
const githubRouter = require("./github")
const adminRouter = require("./admin")
const Admin = require("./database/admin")
const Sentry = require("@sentry/node")
const { getSession } = require("next-auth/react")

Sentry.init({
  dsn: "https://7304e503172043e4b408c7e6ba33ef3e@o1200475.ingest.sentry.io/6324451",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require("helmet")())

app.get("/", (_, res) => {
  res.status(200).send("Welcome to the Deck API. To learn more or sign up for Deck, visit https://withdeck.com")
})

// user must be logged in with their email address to call the backend
const authenticateRequest = async (req, res, next) => {
  const session = await getSession({ req })
  if (session) {
    const email = session.user.email
    let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))
    if (!admin) {
      // if the user logs in for the first time, create a collection with the email field as provided by auth0
      Admin.create(
        {
          email: email,
          github: {
            apiKey: "",
            organization: "",
          },
        },
        (err, newAdmin) => {
          if (err) {
            console.error("Error creating admin: ", err)
            return res.status(500).json({ ok: false, message: err })
          }
          admin = newAdmin

          res.status(200).json({ ok: true, admin })
        }
      )

      return
    }

    // save the user email to req.user.email for subsequent routes' use
    req.user = { email }

    next()
  } else res.status(401).json({ ok: false, error: "You must be logged in to access this route." })
}

app.use("/admin", authenticateRequest, adminRouter)
app.use("/github", authenticateRequest, githubRouter)

app.use((error, _, res, next) => {
  console.error(error)

  return res.status(500).json({ ok: false, error: error.message })
})

module.exports = app
