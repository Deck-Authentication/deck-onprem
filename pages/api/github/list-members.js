import withGithubCredentials from "../../middlewares/withGithubCredentials"
import withAuth from "../../middlewares/withAuth"
import nc from "next-connect"
import helmet from "helmet"
import { listAllTeams, listAllOrgMembers, listAllTeamMembersWithTeamSlug } from "../../../utils/github"

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
    // 1. get Github's apiKey and organization from the request
    const { apiKey, organization } = req
    // 2. get all users from the github organization
    let members = await listAllOrgMembers({ apiKey, organization }).catch((err) => next(err))
    // an object to look up the teams for organization members
    // the keys are the member login ids
    // the values are a set of team objects
    let memberTeamsLookup = {}
    // 3. list all teams within the organization to propagate the memberTeamsLookup
    const teams = await listAllTeams({ apiKey, organization }).catch((err) => next(err))
    let teamMembersPromises = []
    teams.map((team) => teamMembersPromises.push(listAllTeamMembersWithTeamSlug({ apiKey, organization, teamSlug: team.slug })))
    await Promise.allSettled(teamMembersPromises).then((responses) => {
      for (let response of responses) {
        if (response.status === "fulfilled") {
          const { members, teamSlug } = response.value
          members.map((member) => {
            if (!memberTeamsLookup[member.login]) memberTeamsLookup[member.login] = new Set([])
            memberTeamsLookup[member.login].add(teamSlug)
          })
        } else throw new Error(response.reason)
      }
    })
    // 4. save the list of teams for each member to the members object
    for (let i = 0; i < members.length; ++i)
      members[i].teams = memberTeamsLookup[members[i].login] ? Array.from(memberTeamsLookup[members[i].login]) : []

    return res.status(200).json({ ok: true, members })
  })

export default withAuth(withGithubCredentials(handler))
