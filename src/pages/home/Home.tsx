import { useEffect, useState } from "react"
import { NavLink } from "react-router"
import ApiClient from "../../utils/ApiClient"

interface Fanfic {
  _id: string
  judul: string
  Genre: string
  createdby: {
    username: string
  }
}

export default function Home() {
  const [fanfic, setFanfic] = useState<Fanfic[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const isLoggedIn = !!localStorage.getItem("AuthToken")

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("AuthToken")
      try {
        const payload = JSON.parse(atob(token!.split('.')[1]))
        setUsername(payload.username || "User")
      } catch {
        setUsername("User")
      }
    }
  }, [isLoggedIn])

  const handleSignOut = () => {
    localStorage.removeItem("AuthToken")
    setUsername(null)
    window.location.reload()
  }

  useEffect(() => {
    const fetchFanfic = async () => {
      try {
        const res = await ApiClient.get("/public/fanfic")
        setFanfic(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFanfic()
  }, [])

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="bg-dark text-white py-5 position-relative">
        <div className="container text-center">
          <h1 className="fw-bold">Fanfic Forge</h1>
          <p className="lead mt-2">
            Platform komunitas untuk menulis dan membaca cerita fiksi
          </p>
          {isLoggedIn ? (
            <p className="mt-2">Welcome back, {username}! You are logged in.</p>
          ) : (
            <p className="mt-2">You are browsing as a guest.</p>
          )}

          <NavLink to={isLoggedIn ? "/add-fanfic" : "/auth"} className="btn btn-primary btn-lg mt-3">
            {isLoggedIn ? "Tambah Cerita" : "Mulai Menulis"}
          </NavLink>
        </div>
        {isLoggedIn && (
          <div className="position-absolute bottom-0 end-0 p-3">
            <button className="btn btn-outline-light" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}
      </section>

      {/* ===== CONTENT ===== */}
      <div className="container my-5">
        <h3 className="mb-4">Cerita Terbaru</h3>

        {loading && (
          <div className="text-center">
            <div className="spinner-border" />
          </div>
        )}

        {!loading && fanfic.length === 0 && (
          <p className="text-muted">Belum ada cerita</p>
        )}

        <div className="row">
          {fanfic.map(item => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-secondary mb-2">
                    {item.Genre}
                  </span>

                  <h5 className="card-title">{item.judul}</h5>

                  <p className="text-muted mb-4">
                    oleh {item.createdby?.username}
                  </p>

                  <NavLink
                    to={`/fanfic/${item._id}`}
                    className="btn btn-outline-primary mt-auto"
                  >
                    Baca Cerita
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-light py-3">
        <div className="container text-center text-muted">
          © {new Date().getFullYear()} Fanfic Forge
        </div>
      </footer>
    </div>
  )
}