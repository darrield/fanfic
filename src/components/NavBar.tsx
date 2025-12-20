import { NavLink, useNavigate } from "react-router"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null)
  const navigate = useNavigate()

  const token = localStorage.getItem("AuthToken")
  const isLoggedIn = !!token

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUsername(payload.username || "User")
      } catch {
        setUsername("User")
      }
    }
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem("AuthToken")
    navigate("/")
    window.location.reload()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          Fanfic Forge
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/add-fanfic">
                  Tulis Cerita
                </NavLink>
              </li>
            )}
          </ul>

          

          {/* ===== USER AREA ===== */}
          
          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <li className="nav-item">
                <NavLink className="btn btn-outline-light" to="/auth">
                  Login
                </NavLink>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  👤 {username}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink className="dropdown-item" to="/profile">
                      Profil Saya
                    </NavLink>
                  </li>
                    <li>
                      <NavLink className="dropdown-item" to="/bookmarks">
                        Bookmark Saya
                      </NavLink>
                    </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
