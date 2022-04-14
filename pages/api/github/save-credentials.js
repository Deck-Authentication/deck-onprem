// save a new pair of Github apiKey & organization to the database

import nc from "next-connect"
import helmet from "helmet"
import Admin from "../../../database/admin"
import initiateDb from "../../../middlewares/initiateDb"
import requireAuth from "../../../middlewares/requireAuth"

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
  .post(async (req, res) => {
    await initiateDb(process.env.MONGODB_URI)
    await requireAuth(req, res)

    const { apiKey, organization } = req.body
    const email = req.user.email

    if (!apiKey || !organization) {
      res.status(400).json({ ok: false, message: "Error: apiKey and organization must be provided as non-empty strings" })
      return
    }

    await Admin.findOneAndUpdate({ email }, { github: { apiKey, organization } })
      .exec()
      .catch((err) => res.status(500).json({ ok: false, message: err }))

    res.status(200).json({ ok: true, message: "Successfully saved Github credentials" })
  })

export default handler
