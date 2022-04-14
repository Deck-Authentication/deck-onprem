// delete a team & remove all members from it

import nc from "next-connect"
import helmet from "helmet"
import requireAuth from "../../../../middlewares/requireAuth"
import initiateDb from "../../../../middlewares/initiateDb"
import checkGithubCredentials from "../../../../middlewares/checkGithubCredentials"
import { deleteTeam } from "../../../../utils/github"

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
    await initiateDb(process.env.MONGO_URI)
    await requireAuth(req, res)
    await checkGithubCredentials(req, res)

    const { apiKey, organization } = req.github
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

export default handler
