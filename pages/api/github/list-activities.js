import { listOrgActivities } from "../../../utils/github"
import { getSession } from "next-auth/react"
import Admin from "../../../database/admin"
import nc from "next-connect"
import helmet from "helmet"

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
    const session = await getSession({ req })
    if (!session) return res.status(401).json({ ok: false, error: "Unauthorized" })
    else {
      req.user = {
        email: session.user.email,
      }
      const email = session.user.email
      let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))

      if (!admin) {
        // if the user logs in for the first time, create a collection with the email field as provided
        await Admin.create(
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
      const { apiKey, organization } = github

      req.apiKey = apiKey
      req.organization = organization
    }

    // 1. get Github's apiKey and organization from the request
    const { apiKey, organization } = req
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

// async function handler(req, res) {
//   const session = await getSession({ req })
//   if (!session) return res.status(401).json({ ok: false, error: "Unauthorized" })
//   else {
//     req.user = {
//       email: session.user.email,
//     }
//     const email = session.user.email
//     let admin = await Admin.findOne({ email }).catch((err) => res.status(500).json({ ok: false, message: err.message }))

//     if (!admin) {
//       // if the user logs in for the first time, create a collection with the email field as provided
//       await Admin.create(
//         {
//           email: email,
//           github: {
//             apiKey: "",
//             organization: "",
//           },
//         },
//         (err) => {
//           if (err) {
//             console.error("Error creating admin: ", err)
//             return res.status(500).json({ ok: false, message: err })
//           }
//         }
//       )
//     }

//     const { github } = admin
//     if (!github || !github.apiKey || !github.organization)
//       return res.status(404).json({ ok: false, message: "Error: Github credentials not found" })
//     const { apiKey, organization } = github

//     req.apiKey = apiKey
//     req.organization = organization
//   }

//   // 1. get Github's apiKey and organization from the request
//   const { apiKey, organization } = req
//   const { perPage } = req.query

//   // 2. get all activities in the github organization
//   const allActivities = await listOrgActivities({ apiKey, organization, perPage }).catch((err) => {
//     throw new Error(err)
//   })

//   // 3. Refine the activities to return only org & team-related ones
//   const activities = allActivities.filter((activity) => {
//     if (!activity.action) return false
//     switch (activity.action) {
//       case "team.add_member":
//       case "team.remove_member":
//       case "org.add_member":
//       case "org.invite_member":
//       case "team.add_repository":
//         return true
//       default:
//         return false
//     }
//   })

//   return res.status(200).json({ ok: true, activities })
// }

export default handler
