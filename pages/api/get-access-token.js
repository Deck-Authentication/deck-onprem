export default async function handler(req, res) {
  // If your access token is expired and you have a refresh token,
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant

  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["read:current_user", "profile", "email", "openid"],
  })

  res.status(200).json({ accessToken })
}
