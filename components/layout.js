import Menu from "./menu.js"
import Header from "./header.js"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import { useSession, signIn } from "next-auth/react"

function Layout(props) {
  const { data: session } = useSession()

  if (!session)
    return (
      <>
        Not signed in
        <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
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
