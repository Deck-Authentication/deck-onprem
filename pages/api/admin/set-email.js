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
  .put(async (req, res) => {
    await initiateDb(process.env.MONGO_URI)
    await requireAuth(req, res)
    const newEmail = req.body.email
    const oldEmail = req.user.email
    await Admin.findOneAndUpdate({ email: oldEmail }, { email: newEmail }).catch((err) =>
      res.status(500).json({ ok: false, err })
    )
    res.status(200).json({ ok: true, message: "Admin email updated" })
  })

export default handler
