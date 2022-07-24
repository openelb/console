import BaseLayout from "./layouts/BaseLayout"
import BGP from "../pages/bgps/App"

const routes = [
  {
    path: "/",
    element: <BaseLayout />,
    routes: [
      {
        path: "bgp/*",
        element: <BGP />
      }
    ]
  }
]

export default routes