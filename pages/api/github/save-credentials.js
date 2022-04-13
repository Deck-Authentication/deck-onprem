import nc from "next-connect"
import helmet from "helmet"
import Admin from "../../database/admin"
import withAuth from "../../middlewares/withAuth"

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

export default withAuth(handler)
