import { Outlet } from "react-router"
import Navbar from "../components/NavBar"

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
