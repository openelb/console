import { Outlet } from "react-router-dom"
import Navbar from "../../components/Navbar/index"

export default function BaseLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}