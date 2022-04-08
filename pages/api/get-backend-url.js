export default async function handler(_, res) {
  return res.status(200).json({ ok: true, backendUrl: process.env.BACKEND_URL })
}
