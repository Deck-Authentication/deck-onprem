import { useGithubOrgMembers } from "../../utils"
import Link from "next/link"
import { useAdminData } from "../../utils"

export default function User() {
  const { admin, loadAdminError } = useAdminData(`/backend/admin/get-all-data`)
  const { members, membersLoadingError } = useGithubOrgMembers(`/backend/github/list-members`)

  if (loadAdminError)
    return (
      <div>Unable to load your data. Contact us at peter@withdeck.com and we will resolve this issue as soon as possible</div>
    )
  else if (!admin) return <div>Loading...</div>

  const { github } = admin
  if (!github?.apiKey || !github?.organization)
    return <div>You need to set up your github account first under the Application tab.</div>

  if (membersLoadingError) return <div>{JSON.stringify(membersLoadingError)}</div>
  if (!members) return <div>loading...</div>

  if (!members || members.length === 0) return <div className="member">No members found</div>

  return (
    <div className="member px-8">
      <div className="border-b border-b-black my-8 ">
        <h1 className="text-4xl font-bold">User</h1>
      </div>
      <table className="table w-full table-zebra" data-theme="light">
        <thead>
          <tr className="hover:mix-blend-multiply">
            <th>ID</th>
            <th>Name</th>
            <th>Github Account</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(members).map((memberId, key) => {
            const member = members[memberId]
            return (
              <tr className="hover:mix-blend-multiply cursor-pointer" key={`${memberId}_${key}`}>
                <th>{key + 1}</th>
                <td>{member.login}</td>
                <td>{member.html_url}</td>
                <td className="flex flex-row gap-2">
                  {member.teams.map((team, id) => (
                    <Link key={id} href={`/team/${team}`} passHref>
                      <a className="p-2 border rounded-lg hover:bg-gray-200">{team}</a>
                    </Link>
                  ))}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
