// create a new team in a Github organization

import nc from "next-connect"
import helmet from "helmet"
import { createTeam } from "../../../../utils/github"
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
  .post(async (req, res) => {
    await initiateDb(process.env.MONGO_URI)
    await requireAuth(req, res)
    await checkGithubCredentials(req, res)
    const { apiKey, organization } = req.github
    // team name can contain whitespaces
    const { team } = req.body
    let createTeamError
    const newTeam = await createTeam({ apiKey, organization, teamName: team }).catch((error) => {
      console.error(error)
      createTeamError = error
    })

    return createTeamError
      ? res.status(500).json({ ok: false, error: createTeamError })
      : res.status(200).json({ ok: true, team: newTeam })
  })

export default handler
