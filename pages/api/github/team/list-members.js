// list all members in a github organization

import nc from "next-connect"
import helmet from "helmet"
import { listAllTeamMembers } from "../../../../utils/github"
import Admin from "../../../../database/admin"
import requireAuth from "../../../../middlewares/requireAuth"
import initiateDb from "../../../../middlewares/initiateDb"
import checkGithubCredentials from "../../../../middlewares/checkGithubCredentials"

const handler = nc({
  onError: (err, _, res, next) => {
    console.error(err.stack)
    res.status(500).json({ ok: false, error: "Internal server error" })
  },
  onNoMatch: (_, res) => {
    res.status(404).json({ ok: false, error: "Not found" })
  },
})
  .use(helmet())
  .get(async (req, res) => {
    await initiateDb(process.env.MONGO_URI)
    await requireAuth(req, res)
    await checkGithubCredentials(req, res)

    const { apiKey, organization } = req.github
    const { email } = req.user
    let admin = await Admin.findOne({ email }).catch((err) => {
      console.error(err)
      res.status(500).json({ ok: false, message: err })
    })
    const { teamSlug } = req.query
    if (!admin.teams) return res.status(404).json({ ok: false, message: "No team found" })

    const members = await listAllTeamMembers({ apiKey, organization, teamSlug }).catch((error) => {
      console.error(error)
      throw new Error(error)
    })

    return res.status(200).json({ ok: true, members })
  })

export default handler
