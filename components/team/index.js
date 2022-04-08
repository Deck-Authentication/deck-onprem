import Link from "next/link"
import { XCircleIcon } from "@heroicons/react/solid"
import { useState } from "react"
import { useGithubTeamRepos, useGithubTeamMembers } from "../../utils"

export function TeamCard({ team, cardKey, BACKEND_URL, href, handleDeleteTeam }) {
  const { name, slug } = team
  const borderTopColors = [
    "border-t-blue-300",
    "border-t-red-300",
    "border-t-green-300",
    "border-t-purple-300",
    "border-t-orange-300",
    "border-t-yellow-300",
  ]
  const cardBorderTopColor = borderTopColors[cardKey % 6]
  const TeamCardStyles = `defined-card relative w-1/5 min-w-max h-36 mt-2 mr-2 bg-white cursor-pointer hover:shadow-lg border-gray-100 border-t-8 ${cardBorderTopColor}`

  const { repos, loadReposError } = useGithubTeamRepos(`${BACKEND_URL}/github/team/list-repos?teamSlug=${slug}`)
  const { members, loadMembersError } = useGithubTeamMembers(`${BACKEND_URL}/github/team/list-members?teamSlug=${slug}`)

  if (loadReposError) return <div>Failed to load repos</div>
  else if (loadMembersError) return <div>Failed to load team members</div>
  if (!members || !repos) return <div>Loading...</div>

  return (
    <Link href={href} key={cardKey} passHref>
      <a className={TeamCardStyles}>
        <XCircleIcon
          className="absolute z-10 h-6 w-6 top-0 right-0 hover:text-red-600"
          onClick={(event) => {
            event.preventDefault()
            handleDeleteTeam(team)
          }}
        />
        <div className="card-body">
          <div className="card-title w-full flex justify-between">
            <h2>{name}</h2>
          </div>
          <div>Number of repositories: {repos ? repos.length : 0}</div>
          <div>Number of members: {members ? members.length : 0}</div>
        </div>
      </a>
    </Link>
  )
}

export function CreateTeamBtn({ isCreating, handleCreateTeam }) {
  const [teamName, setTeamName] = useState("")

  return (
    <div className="create-team-btn w-full flex">
      <label
        htmlFor="add-template-modal"
        className="modal-button btn btn-primary btn-sm cursor-pointer normal-case p-1 hover:opacity-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Create Team
      </label>
      <input type="checkbox" id="add-template-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-white p-10">
          <input
            type="text"
            placeholder="Team Name"
            className="text-xl w-full rounded-2xl p-2 border border-blue-300"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
          />
          <div className="modal-action">
            <label
              htmlFor="add-template-modal"
              className={`btn btn-primary ${isCreating ? "loading" : ""}`}
              onClick={async (event) => {
                event.preventDefault()
                handleCreateTeam(teamName)
              }}
            >
              Create
            </label>
            <label htmlFor="add-template-modal" className="btn">
              Cancel
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
