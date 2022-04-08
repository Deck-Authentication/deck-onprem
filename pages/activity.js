import { useGithubOrgActivities } from "../utils"
import { useAdminData } from "../utils"

export default function Activity({ BACKEND_URL }) {
  const { admin, loadAdminError } = useAdminData(`${BACKEND_URL}/admin/get-all-data`)
  const { activities, loadActivitiesError } = useGithubOrgActivities(`${BACKEND_URL}/github/list-activities?perPage=100`)

  if (loadAdminError)
    return (
      <div>Unable to load your data. Contact us at peter@withdeck.com and we will resolve this issue as soon as possible</div>
    )
  else if (!admin) return <div>Loading...</div>

  const { github } = admin
  if (!github?.apiKey || !github?.organization)
    return <div>You need to set up your github account first under the Application tab.</div>

  if (loadActivitiesError) return <div>Error loading activities</div>
  else if (!activities) return <div>Loading activities...</div>

  return (
    <div className="activities px-8">
      <div className="w-full border-b border-b-black my-8">
        <h1 className="text-4xl font-bold">Activity</h1>
      </div>
      <ul>
        {activities.map((activity, loopId) => (
          <li key={loopId} className="log-msg border border-gray-300 p-2">
            <LogMessage activity={activity} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function LogMessage({ activity }) {
  const unixTimestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp)
    return date.toLocaleString("en-US", { timeZoneName: "short" })
  }

  const { action, actor, created_at, user, org, team } = activity
  let actionVerb = "",
    actionSubject = "to"

  switch (action) {
    case "team.add_member":
    case "org.add_member":
      actionVerb = "added"
      break
    case "team.remove_member":
    case "org.remove_member":
      actionVerb = "removed"
      actionSubject = "from"
      break
    case "org.invite_member":
      actionVerb = "invited"
      break
    default:
      actionVerb = "(undetected activity)"
      break
  }
  const destination = () => {
    const content = team ? team : org
    const href = team ? `https://github.com/orgs/${org}/teams/${team.split("/")[1]}` : `https://github.com/${org}`

    return (
      <a href={href} className="text-blue-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return (
    <div className="">
      <a
        href={`https://github.com/${actor}`}
        className="text-blue-600 font-semibold hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {actor}
      </a>{" "}
      {actionVerb}{" "}
      <a
        href={`https://github.com/${user}`}
        className="text-blue-600 font-semibold hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {user}
      </a>{" "}
      {actionSubject} the {destination()} {team ? "team" : "organization"}| Time: {unixTimestampToDate(created_at)}
    </div>
  )
}

export async function getStaticProps() {
  const BACKEND_URL = process.env.BACKEND_URL

  return {
    props: { BACKEND_URL },
  }
}
