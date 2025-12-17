import { Outlet } from "react-router"
import Navbar from "../components/NavBar"

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default MainLayout