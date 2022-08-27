import Detail from "./Detail"
import List from "./List"

const routes = [
  {
    path: '/eip/:eip',
    component: Detail,
  },
  {
    path: '/eip',
    component: List,
    exact: true
  }
]

export default routes