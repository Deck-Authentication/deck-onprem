import useSWR from "swr"
import axios from "axios"

export async function getAccessToken() {
  const { accessToken } = await axios
    .get("/api/get-access-token")
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
      throw new Error(err)
    })
  return accessToken
}
// list all members within a github organization
export function useGithubOrgMembers(url = "") {
  const fetchMembers = async (_url) => {
    const accessToken = await getAccessToken()
    return await axios
      .get(_url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data.members)
  }

  const { data, error } = useSWR(url, fetchMembers)

  return {
    members: data,
    membersLoadingError: error,
  }
}

export function useAdminData(url = "") {
  const fetcher = async (_url) => {
    const accessToken = await getAccessToken()
    return await axios.get(`${_url}`, { headers: { Authorization: `Bearer ${accessToken}` } }).then((res) => res.data.admin)
  }

  const { data, error } = useSWR(url, fetcher)

  return {
    admin: data,
    loadAdminError: error,
  }
}

export async function saveGithubCredentials(url = "", apiKey = "", organization = "") {
  const accessToken = await getAccessToken()
  const result = await axios
    .post(url, { apiKey, organization }, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((res) => res.data)

  if (!result?.ok) throw new Error(result?.message)

  return result
}

export async function importNewData(url = "") {
  const accessToken = await getAccessToken()
  const result = await axios.put(url, {}, { headers: { Authorization: `Bearer ${accessToken}` } }).then((res) => res.data)

  if (!result?.ok) throw new Error(result?.message)

  return result
}

export function useGithubTeams(url = "") {
  const fetchTeams = async (_url) => {
    const accessToken = await getAccessToken()
    return await axios
      .get(_url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data.teams)
  }

  const { data, error } = useSWR(url, fetchTeams)

  return {
    teams: data,
    teamsLoadError: error,
  }
}

// fetch all the repositories of a team from github
export function useGithubTeamRepos(url = "") {
  const fetcher = async (url) => {
    const accessToken = await getAccessToken()
    return await axios.get(`${url}`, { headers: { Authorization: `Bearer ${accessToken}` } }).then((res) => {
      if (!res.data.ok) throw new Error(res.data.message)
      return res.data.repos
    })
  }
  const { data, error } = useSWR(url, fetcher)

  return {
    repos: data,
    loadReposError: error,
  }
}

export function useGithubTeamMembers(url = "") {
  const fetcher = async (url) => {
    const accessToken = await getAccessToken()
    return await axios.get(`${url}`, { headers: { Authorization: `Bearer ${accessToken}` } }).then((res) => {
      if (!res.data.ok) throw new Error(res.data.message)
      return res.data.members
    })
  }
  const { data, error } = useSWR(url, fetcher)

  return {
    members: data,
    loadMembersError: error,
  }
}

export function useGithubOrgActivities(url = "") {
  const fetcher = async (url) => {
    const accessToken = await getAccessToken()
    return await axios.get(`${url}`, { headers: { Authorization: `Bearer ${accessToken}` } }).then((res) => res.data.activities)
  }
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 500 })

  return {
    activities: data,
    loadActivitiesError: error,
  }
}

export async function createNewTeam(url = "", team) {
  const accessToken = await getAccessToken()
  const result = await axios
    .post(url, { team }, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((res) => res.data)

  if (!result?.ok) throw new Error(result?.error)
  return result.team
}

export async function deleteTeam(url = "", team) {
  const accessToken = await getAccessToken()
  const result = await axios
    .delete(url, { data: { teamSlug: team }, headers: { Authorization: `Bearer ${accessToken}` } })
    .then((res) => res.data)

  if (!result?.ok) throw new Error(result?.error)
  return result
}

export async function inviteMemberToTeam(url = "", teamSlug, memberAccount) {
  const accessToken = await getAccessToken()
  const result = await axios
    .post(url, { teamSlug, member: memberAccount }, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err)
    })

  if (!result?.ok) throw new Error(result?.error)
  return result
}

export async function removeMemberFromTeam(url = "", teamSlug, memberAccount) {
  const accessToken = await getAccessToken()
  const result = await axios
    .delete(url, { data: { teamSlug, member: memberAccount }, headers: { Authorization: `Bearer ${accessToken}` } })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err)
    })

  if (!result?.ok) throw new Error(result?.error)
}
