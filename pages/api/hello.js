// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withAuth from "../../middleware/withAuth"

async function Hello(_, res) {
  return res.status(200).json({ name: "Deck API" })
}

export default withAuth(Hello)
