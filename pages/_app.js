import Layout from "../components/layout"
import "../styles/globals.scss"
import { SessionProvider } from "next-auth/react"
import Head from "next/head"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Deck</title>
        <meta name="title" content="Deck Admin Dashboard" />
        <meta
          name="description"
          content="Deck Admin Dashboard for https://withdeck.com- an application to help you invite teammates into multiple cloud applications in one click"
        />
        <link rel="icon" href="/deck.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp
