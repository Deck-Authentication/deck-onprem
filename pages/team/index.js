import { useGithubTeams, useAdminData, createNewTeam, deleteTeam } from "../../utils"
import { TeamCard, CreateTeamBtn } from "../../components/team"
import { useRouter } from "next/router"
import lodash from "lodash"
import { useState, useRef } from "react"
import { toast } from "react-toastify"
import { toastOption } from "../../constants"
import { useSWRConfig } from "swr"

export default function Teams() {
  const { teams, teamsLoadError } = useGithubTeams(`/api/github/team/list-all`)
  const { admin, loadAdminError } = useAdminData(`/api/admin/get-all-data`)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [isDeletingTeam, setIsDeletingTeam] = useState(false)
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const modalDeleteCheckbox = useRef(null)

  const handleCreateTeam = async (newTeamName) => {
    // disable the create team button while creating team
    setIsCreatingTeam(true)
    const newTeam = await createNewTeam(`/api/github/team/create`, newTeamName)
    setIsCreatingTeam(false)
    // redirect users to the new team page
    router.push(`${router.asPath}/${newTeam.slug}`)
  }

  const handleDeleteTeam = async (team) => {
    setIsDeletingTeam(true)
    await deleteTeam(`/api/github/team/delete`, team.slug)
    // refetch the updated list of teams
    mutate(`/api/github/team/list-all`)
    setIsDeletingTeam(false)
    toast.success(`Team ${team.name} deleted successfully`, toastOption)
  }

  if (loadAdminError)
    return (
      <div>Unable to load your data. Contact us at peter@withdeck.com and we will resolve this issue as soon as possible</div>
    )
  else if (!admin) return <div>Loading...</div>

  const { github } = admin
  if (!github?.apiKey || !github?.organization)
    return <div>You need to set up your github account first under the Application tab.</div>

  if (teamsLoadError) {
    return <div>Unable to load teams. Contact us at peter@withdeck.com and we will resolve this issue as soon as possible</div>
  } else if (!teams) return <div>Loading...</div>

  return (
    <div className="teams w-full h-full flex flex-col items-center p-5">
      <CreateTeamBtn isCreating={isCreatingTeam} handleCreateTeam={handleCreateTeam} />
      {lodash.isArray(teams) && teams.length > 0 ? (
        <div className="mt-5 flex w-full justify-start items-start flex-wrap gap-8">
          {teams.map((team, loopId) => (
            <TeamCard
              cardKey={loopId}
              key={`${team.id}-${loopId}`}
              team={team}
              BACKEND_URL={"/api"}
              href={`${router.asPath}/${team.slug}`}
              handleDeleteTeam={handleDeleteTeam}
            />
          ))}
          <input type="checkbox" id="delete-card-checkbox" className="modal-toggle" ref={modalDeleteCheckbox} />
          <div className="modal">
            <div className="modal-box bg-white p-10">
              <input type="text" placeholder="Team Name" className="text-xl w-full rounded-2xl p-2 border border-blue-300" />
              <div className="modal-action">
                <label
                  htmlFor="delete-card-checkbox"
                  className={`btn btn-primary`}
                  onClick={async (event) => {
                    event.preventDefault()
                  }}
                >
                  Create
                </label>
                <label htmlFor="delete-card-checkbox" className="btn">
                  Cancel
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No team found</div>
      )}
    </div>
  )
}
