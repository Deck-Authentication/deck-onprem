import { listOrgActivities } from "../../../utils/github"
import nc from "next-connect"
import helmet from "helmet"
import initiateDb from "../../../middlewares/initiateDb"
import requireAuth from "../../../middlewares/requireAuth"
import checkGithubCredentials from "../../../middlewares/checkGithubCredentials"

// list all activities in a Github organization
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
    await checkGithubCredentials(req, res)

    // 1. get Github's apiKey and organization from the request
    const { apiKey, organization } = req.github
    const { perPage } = req.query

    // 2. get all activities in the github organization
    const allActivities = await listOrgActivities({ apiKey, organization, perPage }).catch((err) => {
      throw new Error(err)
    })

    // 3. Refine the activities to return only org & team-related ones
    const activities = allActivities.filter((activity) => {
      if (!activity.action) return false
      switch (activity.action) {
        case "team.add_member":
        case "team.remove_member":
        case "org.add_member":
        case "org.invite_member":
        case "team.add_repository":
          return true
        default:
          return false
      }
    })

    return res.status(200).json({ ok: true, activities })
  })

export default handler
