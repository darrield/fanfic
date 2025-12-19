import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router"

interface UserPayload {
  username: string
}

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserPayload | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("AuthToken")

    if (!token) {
      navigate("/auth/signIn")
      return
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUser({ username: payload.username })
    } catch {
      localStorage.removeItem("AuthToken")
      navigate("/auth/signIn")
    }
  }, [navigate])

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              
              {/* Avatar */}
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 100, height: 100, fontSize: 36 }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* Username */}
              <h4 className="mb-1">{user.username}</h4>
              <p className="text-muted mb-4">Penulis di Fanfic Forge</p>

              {/* Action */}
              <div className="d-grid gap-2">
                <NavLink to="/add-fanfic" className="btn btn-primary">
                  Tulis Cerita Baru
                </NavLink>
                <NavLink to="/" className="btn btn-outline-secondary">
                  Kembali ke Home
                </NavLink>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
