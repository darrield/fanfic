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
    _id: string
    username: string
  }
}

function FollowFanfic() {
  const [stories, setStories] = useState<Fanfic[]>([])
  const [loading, setLoading] = useState(true)

  const isLoggedIn = !!localStorage.getItem("AuthToken")

  if (!isLoggedIn) {
    return <Navigate to="/auth" />
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const followingRes = await ApiClient.get("/following")
        const following = followingRes.data.data || [] 
        
        const followedIds = following.map((u: any) => u._id)
        const followedUsernames = following.map((u: any) => u.username)

        const fanficRes = await ApiClient.get("/public/fanfic")
        const allFanfics = fanficRes.data.data || []

        const filteredStories = allFanfics.filter((f: any) => {
            if (!f.createdby) return false
            return followedIds.includes(f.createdby._id) || followedUsernames.includes(f.createdby.username)
        })

        setStories(filteredStories)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container my-5">
      <h2 className="mb-4">Cerita Penulis 📔📕📑.</h2>
      <p className="text-muted">Cerita terbaru dari penulis yang kamu ikuti.</p>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && stories.length === 0 && (
        <div className="text-center py-5">
            <p className="text-muted">Belum ada cerita dari penulis yang kamu ikuti.</p>
            <NavLink to="/" className="btn btn-primary">
                Cari Penulis Baru
            </NavLink>
        </div>
      )}

      <div className="row">
        {stories.map((item) => (
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

export default FollowFanfic