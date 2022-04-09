// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ ok: false, error: "Unauthorized" })
  else return res.status(200).json({ name: "Deck API" })
}
