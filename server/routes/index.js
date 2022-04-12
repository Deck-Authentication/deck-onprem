const express = require("express")
const router = express.Router()
const { getSession } = require("next-auth/react")

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(require("helmet")())

router.get("/test", async (req, res) => {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ ok: false, error: "Unauthorized" })
  else return res.status(200).json({ name: session })
})
// router.use(withApiAuthRequired(async (req, res) => {}))

// router.get("/movies", jwtCheck, (req, res) => {
//   // const { user } = getSession(req, res)
//   res.status(200).json({ msg: "We made it! And it's great" })
// })

module.exports = router
