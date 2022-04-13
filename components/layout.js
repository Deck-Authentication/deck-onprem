import Menu from "./menu.js"
import Header from "./header.js"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import { useSession, signIn } from "next-auth/react"
import Spinner from "./spinner"

function Layout(props) {
  const { data: session, status } = useSession()

  if (status === "loading")
    return (
      <div className="w-screen h-screen grid place-content-center">
        <Spinner />
      </div>
    )
  else if (status === "unauthenticated")
    return (
      <div className="w-screen h-screen grid place-content-center bg-indigo-400 gap" data-theme="light">
        <h1 className="text-3xl">Welcome to Deck. Let&#39;s sign in to view this page</h1>
        <br />
        <button onClick={() => signIn()} className="btn text-xl">
          Sign in
        </button>
      </div>
    )

  return (
    <div
      className="flex flex-row min-h-screen min-w-screen text-black relative"
      style={{ backgroundColor: "rgb(241, 245, 249)" }}
    >
      <Menu />
      <div className="grow h-screen flex flex-col">
        <Header />
        <section className="w-full h-full overflow-y-scroll">{props.children}</section>
        {/* One single toast container for the whole project to avoid conflicts */}
        <ToastContainer />
      </div>
    </div>
  )
}

export default Layout
