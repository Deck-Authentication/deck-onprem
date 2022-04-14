import Admin from "../database/admin"

// check if the github apiKey & organization exist in the database & save them to the req.
export default async function handler(req, res) {
  const { email } = req.user

  let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))

  if (!admin) {
    // if the user logs in for the first time, create a collection with the email field as provided
    admin = await Admin.create(
      {
        email: email,
        github: {
          apiKey: "",
          organization: "",
        },
      },
      (err) => {
        if (err) {
          console.error("Error creating admin: ", err)
          return res.status(500).json({ ok: false, message: err })
        }
      }
    )
  }

  const { github } = admin
  if (!github || !github.apiKey || !github.organization)
    return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })

  // save the github apiKey & organization to the request for subsequent uses
  req.github = {
    apiKey: github.apiKey,
    organization: github.organization,
  }
}
