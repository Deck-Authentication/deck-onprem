import { useGithubTeamRepos, useGithubTeamMembers, inviteMemberToTeam, removeMemberFromTeam } from "../../utils"
import { useRouter } from "next/router"
import { useState } from "react"
import Image from "next/image"
import { toast } from "react-toastify"
import { toastOption } from "../../constants"
import { useSWRConfig } from "swr"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

export default function Team({ id, BACKEND_URL }) {
  const teamSlug = id
  const router = useRouter()
  const { repos, loadReposError } = useGithubTeamRepos(`${BACKEND_URL}/github/team/list-repos?teamSlug=${teamSlug}`)
  const { members, loadMembersError } = useGithubTeamMembers(`${BACKEND_URL}/github/team/list-members?teamSlug=${teamSlug}`)
  const [tab, setTab] = useState(router.query.tab || "repositories")

  if (loadReposError) return <div>Failed to load repos</div>
  else if (loadMembersError) return <div>Failed to load members</div>
  if (!repos || !members) return <div>Loading...</div>

  const handleTabChange = (event, newTab) => {
    event.preventDefault()
    setTab(newTab)
  }

  return (
    <div className="team w-full h-full p-5">
      <h1 className="text-4xl font-bold mb-10">{teamSlug}</h1>
      <div className="tabs my-4" data-theme="corporate">
        {["repositories", "members"].map((_tab, loopId) => (
          <a
            key={`${_tab}-${loopId}`}
            className={`capitalize tab tab-bordered ${_tab === tab ? "font-bold border-orange-600" : ""}`}
            onClick={(e) => handleTabChange(e, _tab)}
          >
            {_tab}
          </a>
        ))}
      </div>
      {tab === "repositories" ? (
        <TeamRepos repos={repos} />
      ) : (
        <TeamMembers members={members} teamSlug={id} BACKEND_URL={BACKEND_URL} />
      )}
    </div>
  )
}

function TeamRepos({ repos }) {
  return (
    <table className="w-full border-collapse" data-theme="light">
      <thead className="border-2 border-black p-2">
        <tr>
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Role</th>
        </tr>
      </thead>
      {repos.map((repo, loopId) => (
        <tbody key={loopId} className="w-full border-2 border-black p-2">
          <tr className="w-full border border-black rounded-lg">
            <td className="p-2">{repo.name}</td>
            <td className="p-2">{repo.role_name}</td>
          </tr>
        </tbody>
      ))}
    </table>
  )
}

function TeamMembers({ members, teamSlug, BACKEND_URL }) {
  const [isCreating, setIsCreating] = useState(false)
  const { mutate } = useSWRConfig()

  const handleMemberAdd = async (memberAccount) => {
    // avoid inviting empty-string members
    if (!memberAccount) return
    setIsCreating(true)
    const response = await inviteMemberToTeam(`${BACKEND_URL}/github/team/invite-member`, teamSlug, memberAccount)
    if (response.ok) {
      // reload the cache after adding a new member
      mutate(`${BACKEND_URL}/github/team/list-members?teamSlug=${teamSlug}`)
      toast.success("Member added", toastOption)
    } else toast.error(`Error in adding ${memberAccount}`, toastOption)
    setIsCreating(false)
  }

  const handleMemberRemove = async (memberAccount) => {
    // avoid removing empty-string members
    if (!memberAccount) return
    try {
      await removeMemberFromTeam(`${BACKEND_URL}/github/team/remove-member`, teamSlug, memberAccount)
      // reload the cache after adding a new member
      mutate(`${BACKEND_URL}/github/team/list-members?teamSlug=${teamSlug}`)
      toast.success(`${memberAccount} is successfully removed from your team`, toastOption)
    } catch (error) {
      toast.error(`Error in removing ${memberAccount}`, toastOption)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <AddMemberBtn isCreating={isCreating} handleMemberAdd={handleMemberAdd} />
      <div>
        {members.map((member, key) => (
          <div key={key} className="border border-black flex flex-row justify-between items-center py-2 px-4">
            <p className="flex flex-row items-center gap-2">
              <Image
                className="mask mask-circle ring ring-primary ring-blue-500 ring-offset-2"
                src={member.avatar_url}
                alt={`User ${member.login}`}
                width={50}
                height={50}
                priority={true}
              />
              {member.login}
            </p>
            <FontAwesomeIcon
              icon={faTrashAlt}
              width="20"
              height="20"
              className="cursor-pointer hover:text-red-400"
              onClick={(_) => handleMemberRemove(member.login)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function AddMemberBtn({ isCreating, handleMemberAdd }) {
  const [memberAccount, setMemberAccount] = useState("")

  return (
    <div className="add-member-btn w-full flex justify-end">
      <label
        htmlFor="add-template-modal"
        className="modal-button pill-btn btn-primary cursor-pointer normal-case p-1 hover:opacity-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Member
      </label>
      <input type="checkbox" id="add-template-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box bg-white p-10">
          <input
            type="text"
            placeholder="Member account"
            className="text-xl w-full rounded-2xl p-2 border border-blue-300"
            value={memberAccount}
            onChange={(event) => setMemberAccount(event.target.value)}
          />
          <div className="modal-action">
            <label
              htmlFor="add-template-modal"
              className={`btn btn-primary ${isCreating ? "loading" : ""}`}
              onClick={async (event) => {
                event.preventDefault()
                handleMemberAdd(memberAccount)
              }}
            >
              Add
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

export async function getServerSideProps({ params }) {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"
  const id = params.id
  return {
    props: {
      id,
      BACKEND_URL,
    },
  }
}
