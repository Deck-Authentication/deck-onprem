async function handler(_, res) {
  return res.status(200).send("Welcome to the Deck API. To learn more or sign up for Deck, visit https://withdeck.com")
}

export default handler
