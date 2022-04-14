// list all teams in a github organization

import nc from "next-connect"
import helmet from "helmet"
import { listAllTeams } from "../../../../utils/github"
import initiateDb from "../../../../middlewares/initiateDb"
import requireAuth from "../../../../middlewares/requireAuth"
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
    const teams = await listAllTeams({ apiKey, organization }).catch((err) =>
      res.status(500).json({ ok: false, message: err.message })
    )

    return res.status(200).json({ ok: true, teams })
  })

export default handler
