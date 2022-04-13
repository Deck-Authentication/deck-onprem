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
  .get(async (req, res) => {
    const email = req.user.email

    let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err }))

    return res.status(200).json({ ok: true, admin })
  })

export default withAuth(handler)
