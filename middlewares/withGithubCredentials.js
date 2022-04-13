import Admin from "../database/admin"

export default async function withGithubCredentials(handler) {
  return async function (req, res) {
    const email = req.user.email
    let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err }))
    const { github } = admin
    if (!github || !github.apiKey || !github.organization)
      return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
    const { apiKey, organization } = github

    req.apiKey = apiKey
    req.organization = organization

    return handler(req, res)
  }
}
