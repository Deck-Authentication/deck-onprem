// delete a team & remove all members from it

import withGithubCredentials from "../../middlewares/withGithubCredentials"
import withAuth from "../../middlewares/withAuth"
import nc from "next-connect"
import helmet from "helmet"

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
    const { teamSlug } = req.body

    let deleteTeamError
    await deleteTeam({ apiKey, organization, teamSlug }).catch((error) => {
      console.log(error)
      deleteTeamError = error
    })

    return deleteTeamError
      ? res.status(500).json({ ok: false, error: JSON.stringify(deleteTeamError) })
      : res.status(200).json({ ok: true })
  })

export default withAuth(withGithubCredentials(handler))
