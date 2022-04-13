import withGithubCredentials from "../../../../middlewares/withGithubCredentials"
import withAuth from "../../../../middlewares/withAuth"
import nc from "next-connect"
import helmet from "helmet"
import { listAllTeams } from "../../../../utils/github"

// list all activities in a Github organization
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
    const { apiKey, organization } = req
    const teams = await listAllTeams({ apiKey, organization }).catch((err) =>
      res.status(500).json({ ok: false, message: err.message })
    )

    return res.status(200).json({ ok: true, teams })
  })

export default withAuth(withGithubCredentials(handler))
