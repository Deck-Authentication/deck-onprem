// remove members from a team
import withGithubCredentials from "../../../../middlewares/withGithubCredentials"
import withAuth from "../../../../middlewares/withAuth"
import nc from "next-connect"
import helmet from "helmet"
import { removeMemberFromTeam } from "../../../../utils/github"

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
  .delete(async (req, res) => {
    const { apiKey, organization } = req
    const { teamSlug, member } = req.body

    await removeMemberFromTeam({ apiKey, organization, teamSlug, member }).catch((error) => {
      console.error(error)
      next(error)
    })

    return res.status(200).json({ ok: true, message: `Successfully remove ${member} from ${teamSlug}` })
  })

export default withAuth(withGithubCredentials(handler))
