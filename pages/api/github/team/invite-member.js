// invite a member to a team
import withGithubCredentials from "../../middlewares/withGithubCredentials"
import withAuth from "../../middlewares/withAuth"
import nc from "next-connect"
import helmet from "helmet"
import { inviteMemberToTeam } from "../../../../utils/github"

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
  .post(async (req, res) => {
    const { apiKey, organization } = req
    const { teamSlug, member } = req.body

    await inviteMemberToTeam({ apiKey, organization, teamSlug, member }).catch((error) => {
      console.error(error)
      next(error)
    })

    return res.status(200).json({ ok: true, message: `Successfully invited ${member} to ${teamSlug}` })
  })

export default withAuth(withGithubCredentials(handler))
