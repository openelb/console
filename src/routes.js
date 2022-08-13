
import Layout from "./Layouts"
import BGP from "./pages/BGP"
import EIP from "./pages/EIP"

const routes = [
  {
    component: Layout,
    routes: [
      {
        path: '/bgp',
        component: BGP
      },
      {
        path: '/eip',
        component: EIP
      },
    ]
  }
]


export default routes