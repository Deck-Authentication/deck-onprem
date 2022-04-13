import { getSession } from "next-auth/react"
import Admin from "../database/admin"
import withDatabase from "./withDatabase"
import Sentry from "@sentry/node"

async function withAuth(req, res) {
  return async function (handler) {
    const session = await getSession({ req })
    if (!session) return res.status(401).json({ ok: false, error: "Unauthorized" })
    else {
      Sentry.init({
        dsn: "https://7304e503172043e4b408c7e6ba33ef3e@o1200475.ingest.sentry.io/6324451",
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
      })

      req.user = {
        email: session.user.email,
      }
      const email = session.user.email
      let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))

      if (!admin) {
        // if the user logs in for the first time, create a collection with the email field as provided
        Admin.create(
          {
            email: email,
            github: {
              apiKey: "",
              organization: "",
            },
          },
          (err) => {
            if (err) {
              console.error("Error creating admin: ", err)
              return res.status(500).json({ ok: false, message: err })
            }
          }
        )
      }

      return handler(req, res)
    }
  }
}

export default withDatabase(withAuth)
