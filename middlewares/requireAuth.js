import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ ok: false, error: "Unauthorized" })
  else
    req.user = {
      email: session.user.email,
    }
}
