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
  .put(async (req, res) => {
    const { email } = req.body
    const oldEmail = req.user.email
    await Admin.findOneAndUpdate({ email: oldEmail }, { email }).catch((err) => res.status(500).json({ ok: false, err }))
    res.status(200).json({ ok: true, message: "Admin email updated" })
  })

export default withAuth(handler)
