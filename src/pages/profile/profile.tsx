import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router"
import ApiClient from "../../utils/ApiClient"
import Card from "react-bootstrap/Card"

interface UserPayload {
  _id: string
  username: string
  followers: any[]
  following: any[]
}

interface Fanfic {
  _id: string
  judul: string
  Genre: string
}

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserPayload | null>(null)
  const [fanfics, setFanfics] = useState<Fanfic[]>([])
  const [fanficsLoading, setFanficsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("AuthToken")

    if (!token) {
      navigate("/auth/signIn")
      return
    }

    const fetchData = () => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const userId = payload.user_id
        const username = payload.username

        // Ambil data user
        ApiClient.get(`/users/${userId}`)
          .then(response => {
            setUser(response.data)
          })
          .catch(err => {
            console.error('Failed to fetch user data:', err)
            // Fallback to token data
            setUser({ _id: userId, username, followers: [], following: [] })
          })

        // Ambiel jumlah followers dan following
        Promise.all([
          ApiClient.get('/following').catch(() => ({ data: { data: [] } })),
          ApiClient.get('/followers').catch(() => ({ data: { data: [] } }))
        ]).then(([followingRes, followersRes]) => {
          const following = followingRes.data.data || []
          const followers = followersRes.data.data || []
          setUser(prevUser => prevUser ? {
            ...prevUser,
            following,
            followers
          } : {
            _id: userId,
            username,
            following,
            followers
          })
        }).catch(err => {
          console.error('Failed to fetch follow data:', err)
        })

        // Ambil fanfic
        ApiClient.get('/public/fanfic')
          .then(response => {
            const allFanfics = response.data.data || []
            const userFanfics = allFanfics.filter((fanfic: any) => fanfic.createdby?.username === username)
            setFanfics(userFanfics)
          })
          .catch(err => {
            console.error('Failed to fetch fanfics:', err)
          })
          .finally(() => {
            setFanficsLoading(false)
          })

      } catch (tokenError) {
        console.error('Token parsing failed:', tokenError)
        localStorage.removeItem("AuthToken")
        navigate("/auth/signIn")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleDelete = async (id: string) => {
      if (!window.confirm("Apakah kamu yakin ingin menghapus cerita ini? Tindakan ini tidak bisa dibatalkan.")) {
        return
      }

      try {
        await ApiClient.delete(`/fanfic/${id}`)
        setFanfics(currentFanfics => currentFanfics.filter(f => f._id !== id))
        
      } catch (err) {
        console.error("Gagal menghapus:", err)
        alert("Gagal menghapus cerita. Silakan coba lagi.")
      }
  }

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
              
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 100, height: 100, fontSize: 36 }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              <h4 className="mb-1">{user.username}</h4>
              <p className="text-muted mb-3">Penulis di Fanfic Forge</p>

              <div className="d-flex justify-content-center gap-4 mb-4">
                <div className="text-center">
                  <div className="h5 mb-0">{user.followers?.length || 0}</div>
                  <small className="text-muted">Followers</small>
                </div>
                <div className="text-center">
                  <div className="h5 mb-0">{user.following?.length || 0}</div>
                  <small className="text-muted">Following</small>
                </div>
              </div>

              <div className="d-grid gap-2">
                <NavLink to="/add-fanfic" className="btn btn-dark">
                  Tulis Cerita Baru
                </NavLink>
                <NavLink to="/" className="btn btn-outline-secondary">
                  Kembali ke Home
                </NavLink>
              </div>

            </div>
          </div>

          <div className="mt-5">
            <h5 className="mb-4">Your Stories</h5>
            {fanficsLoading ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" />
              </div>
            ) : fanfics.length > 0 ? (
              <div className="row g-4">
                {fanfics.map(fanfic => (
                  <div key={fanfic._id} className="col-lg-6 col-md-12">
                    <Card className="h-100 shadow-sm border-0 bg-light">
                      <Card.Body className="p-4 d-flex flex-column">
                        <Card.Title className="h5 mb-2 text-dark">{fanfic.judul}</Card.Title>
                        <Card.Text className="text-muted mb-3">
                          <small>Genre: <span className="badge bg-secondary">{fanfic.Genre}</span></small>
                        </Card.Text>
                        
                        <div className="mt-auto d-flex gap-2">
                            <NavLink to={`/fanfic/${fanfic._id}`} 
                                className="btn btn-outline-primary flex-grow-1"
                            >
                                Read Story
                            </NavLink>
                            
                            <NavLink to={`/edit-fanfic/${fanfic._id}`} 
                                className="btn btn-warning"
                            >
                                <i className="bi bi-pencil-square"></i> Edit
                            </NavLink>
                            <button 
                                onClick={() => handleDelete(fanfic._id)} 
                                className="btn btn-danger"
                                title="Hapus Cerita"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted h6">No stories posted yet.</p>
                <NavLink to="/add-fanfic" className="btn btn-primary mt-2">
                  Write Your First Story
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
