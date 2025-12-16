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
      <section className="bg-dark text-white py-5">
        <div className="container text-center">
          <h1 className="fw-bold">Fanfic Forge</h1>
          <p className="lead mt-2">
            Platform komunitas untuk menulis dan membaca cerita fiksi
          </p>

          <NavLink to="/login" className="btn btn-primary btn-lg mt-3">
            Mulai Menulis
          </NavLink>
        </div>
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