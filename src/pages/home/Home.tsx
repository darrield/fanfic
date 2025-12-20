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

function Home() {
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
      {/* ===== HERO ===== className="bg-dark text-white py-5 position-relative"*/}
      <section className="text-white py-5 position-relative" 
        style={{
        backgroundImage : "url('/Lukisan-Abstrak.jpg')",
        backgroundSize : "cover",
        backgroundPosition : "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
        opacity: 0.9,
        height: "300px"
        }
      }
        >
        <div className="container text-center">
          <h1 className="fw-bold">Fanfic Forge</h1>
          <p className="lead mt-1">
            Platform komunitas untuk menulis dan membaca cerita fiksi
          </p>
          {isLoggedIn ? (
            <p className="mt-2">Welcome back, {username}! You are logged in.</p>
          ) : (
            <p className="mt-2">You are browsing as a guest.</p>
          )}

          <NavLink to={isLoggedIn ? "/add-fanfic" : "/auth"} className="btn btn-outline-light btn-lg mt-3">
            {isLoggedIn ? "Tambah Cerita" : "Mulai Menulis"}
          </NavLink>
        </div>

      </section>

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
                    className="btn btn-outline-dark mt-auto"
                  >
                    Baca Cerita
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}

export default Home