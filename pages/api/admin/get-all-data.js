import nc from "next-connect"
import helmet from "helmet"
import Admin from "../../../database/admin"
import { connectDB } from "../../../database"
import mongoose from "mongoose"
import { getSession } from "next-auth/react"

const handler = nc({
  onError: (err, _, res, next) => {
    console.error(err.stack)
    res.status(500).end("Something broke!")
  },
  onNoMatch: (_, res) => {
    res.status(404).end("Page is not found")
  },
})
  .use(helmet())
  .get(async (req, res) => {
    if (!mongoose.connections[0].readyState)
      await connectDB(
        "mongodb://peternguyen:mFcn0weJFTXilPRs@cluster0-shard-00-00.efwue.mongodb.net:27017,cluster0-shard-00-01.efwue.mongodb.net:27017,cluster0-shard-00-02.efwue.mongodb.net:27017/deck_my_kaarma?ssl=true&replicaSet=atlas-11aj2g-shard-0&authSource=admin&retryWrites=true&w=majority"
      )
    const session = await getSession({ req })
    if (!session) return res.status(401).json({ ok: false, error: "Unauthorized" })
    else {
      req.user = {
        email: session.user.email,
      }
      const email = session.user.email
      let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))

      if (!admin) {
        // if the user logs in for the first time, create a collection with the email field as provided
        admin = await Admin.create(
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

      console.log("admin: ", admin)

      return res.status(200).json({ ok: true, admin })
    }
  })

export default handler
