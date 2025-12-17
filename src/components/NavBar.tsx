import { NavLink } from "react-router"

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          Fanfic Forge
        </NavLink>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/auth/signIn" className="nav-link">
              SignIn
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar