import { useEffect, useState } from "react"
import { NavLink, Navigate } from "react-router"
import ApiClient from "../../utils/ApiClient"
import Card from "react-bootstrap/Card"
import Spinner from "react-bootstrap/Spinner"

interface Fanfic {
  _id: string
  judul: string
  Genre: string
  createdby: {
    username: string
  }
}

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Fanfic[]>([])
  const [loading, setLoading] = useState(true)

  const isLoggedIn = !!localStorage.getItem("AuthToken")

  if (!isLoggedIn) {
    return <Navigate to="/auth" />
  }

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await ApiClient.get("/bookmarks")
        setBookmarks(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  return (
    <div className="container my-5">
      <h2 className="mb-4">Bookmark Saya</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && bookmarks.length === 0 && (
        <p className="text-muted">Belum ada cerita yang dibookmark</p>
      )}

      <div className="row">
        {bookmarks.map((item) => (
          <div className="col-md-4 mb-4" key={item._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <span className="badge bg-secondary mb-2">
                  {item.Genre}
                </span>

                <h5>{item.judul}</h5>

                <p className="text-muted mb-4">
                  oleh {item.createdby?.username}
                </p>

                <NavLink
                  to={`/fanfic/${item._id}`}
                  className="btn btn-outline-primary mt-auto"
                >
                  Baca Cerita
                </NavLink>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bookmarks
