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
  .get(async (req, res) => {
    await initiateDb(process.env.MONGO_URI)
    await requireAuth(req, res)
    const email = req.user.email
    let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))

    if (!admin) {
      // if the user logs in for the first time, create a collection with the email field as provided
      admin = await Admin.create(
        {
          email,
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

    return res.status(200).json({ ok: true, admin })
  })

export default handler
