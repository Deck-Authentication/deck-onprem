import Link from "next/link"

export default function Menu() {
  return (
    <aside className="min-h-full bg-zinc-800 text-white py-5 px-3" style={{ minWidth: "260px" }}>
      <Link href="/team" passHref={true}>
        <a>
          <h1 className="text-indigo-400 text-4xl px-3 mb-3 font-bold">Deck</h1>
        </a>
      </Link>
      <ul className="p-4 overflow-y-auto w-full text-base-content">
        <li>
          <Link href="/team" passHref={true}>
            <a className="flex flex-row my-px p-3 rounded-lg hover:bg-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 p-0.5 mr-0.5 rounded"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  background: "linear-gradient(to right, #009fff, #ec2f4b)",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              Team
            </a>
          </Link>
        </li>
        <li>
          <Link href="/user" passHref={true}>
            <a className="flex flex-row my-px p-3 rounded-lg hover:bg-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 p-0.5 mr-0.5 rounded"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                style={{
                  background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }}
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              User
            </a>
          </Link>
        </li>
        <li>
          <Link href="/activity" passHref={true}>
            <a className="flex flex-row my-px p-3 rounded-lg hover:bg-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 p-0.5 mr-0.5 rounded"
                fill="linear-gradient(to right, #b2fefa, #0ed2f7)"
                viewBox="0 0 20 20"
                stroke="currentColor"
                style={{
                  background: "linear-gradient(to right, #74ebd5, #acb6e5)",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              Activity
            </a>
          </Link>
        </li>
        <li>
          <Link href="/application" passHref={true}>
            <a className="flex flex-row my-px p-3 rounded-lg hover:bg-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 p-0.5 mr-0.5 rounded"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                style={{
                  background: "linear-gradient(to right, #76b852, #8dc26f)",
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Application
            </a>
          </Link>
        </li>
      </ul>
    </aside>
  )
}
