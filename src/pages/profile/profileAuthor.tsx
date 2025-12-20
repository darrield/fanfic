import { useEffect, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router"
import ApiClient from "../../utils/ApiClient"
import Card from "react-bootstrap/Card"

interface UserPayload {
  _id: string
  username: string
}

interface Fanfic {
  _id: string
  judul: string
  Genre: string
  createdby: any
}

function ProfileAuthor() {
  const navigate = useNavigate()
  const { username } = useParams<{ username: string }>()
  
  const [user, setUser] = useState<UserPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fanfics, setFanfics] = useState<Fanfic[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Muat status tombol dari LocalStorage (menjaga konsistensi tombol saat penyegaran)
  const loadFollowButtonState = (authorId: string, userId: string) => {
    const followedAuthors = JSON.parse(localStorage.getItem(`followedAuthors_${userId}`) || '[]')
    setIsFollowing(followedAuthors.includes(authorId))
  }

  const handleToggleFollow = () => {
    if (!user || !currentUserId || followLoading) return

    setFollowLoading(true)
    ApiClient.post(`/follow/${user._id}`)
      .then(response => {
        const nowFollowing = response.data.isFollowing
        setIsFollowing(nowFollowing)
        
        // Perbarui LocalStorage agar tombol tetap benar saat halaman dimuat ulang.
        const followedAuthors = JSON.parse(localStorage.getItem(`followedAuthors_${currentUserId}`) || '[]')
        
        if (nowFollowing) {
          if (!followedAuthors.includes(user._id)) {
            followedAuthors.push(user._id)
          }
        } else {
          const index = followedAuthors.indexOf(user._id)
          if (index > -1) {
            followedAuthors.splice(index, 1)
          }
        }
        localStorage.setItem(`followedAuthors_${currentUserId}`, JSON.stringify(followedAuthors))
      })
      .catch(error => {
        console.error('Follow failed:', error)
      })
      .finally(() => {
        setFollowLoading(false)
      })
  }

  useEffect(() => {
    const token = localStorage.getItem("AuthToken")

    if (!token) {
      navigate("/auth/signIn")
      return
    }

    // Ambil User ID
    let userId = ""
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      userId = payload.user_id
      setCurrentUserId(userId)
    } catch {
      navigate("/auth/signIn")
      return
    }

    if (!username) {
      setError("Username not provided")
      setLoading(false)
      return
    }

    // Ambil Fanfic dari data author
    ApiClient.get('/public/fanfic')
      .then(response => {
        const allFanfics = response.data.data || []
        const authorFanfics = allFanfics.filter((fanfic: any) => fanfic.createdby?.username === username)
        setFanfics(authorFanfics)

        if (authorFanfics.length > 0) {
          const authorData = authorFanfics[0].createdby
          
          setUser({
            _id: authorData._id,
            username: authorData.username,
          })

          // Cek status follow  
          if (userId && authorData._id !== userId) {
            if (authorData.followers && Array.isArray(authorData.followers)) {
               const isInList = authorData.followers.some((f: any) => 
                 (typeof f === 'string' ? f : f._id) === userId
               )
               setIsFollowing(isInList)
               
               const followedAuthors = JSON.parse(localStorage.getItem(`followedAuthors_${userId}`) || '[]')
               if (isInList && !followedAuthors.includes(authorData._id)) {
                 followedAuthors.push(authorData._id)
                 localStorage.setItem(`followedAuthors_${userId}`, JSON.stringify(followedAuthors))
               }
            } else {
              loadFollowButtonState(authorData._id, userId)
            }
          }
        } else {
          setUser({
            _id: 'unknown',
            username,
          })
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load fanfics:', err)
        setError("Author not found")
        setLoading(false)
      })
  }, [navigate, username])

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mt-5 text-center">
        <p>{error || "Author not found"}</p>
        <NavLink to="/" className="btn btn-outline-secondary">
          Kembali ke Home
        </NavLink>
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
              <p className="text-muted mb-4">Penulis di Fanfic Forge</p>

              {currentUserId && user._id !== currentUserId && (
                <div className="d-grid gap-2 mb-4">
                  <button
                    className={`btn ${isFollowing ? 'btn-outline-secondary' : 'btn-primary'}`}
                    onClick={handleToggleFollow}
                    disabled={followLoading}
                  >
                    {followLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {isFollowing ? 'Unfollowing...' : 'Following...'}
                      </>
                    ) : (
                      isFollowing ? 'Unfollow' : 'Follow'
                    )}
                  </button>
                </div>
              )}

              <div className="d-grid gap-2">
                <NavLink to="/" className="btn btn-outline-secondary">
                  Kembali ke Home
                </NavLink>
              </div>

            </div>
          </div>

          <div className="mt-5">
            <h5 className="mb-4">Stories by {user.username}</h5>
            {fanfics.length > 0 ? (
              <div className="row g-4">
                {fanfics.map(fanfic => (
                  <div key={fanfic._id} className="col-lg-6 col-md-12">
                    <Card className="h-100 shadow-sm border-0 bg-light">
                      <Card.Body className="p-4">
                        <Card.Title className="h5 mb-2 text-dark">{fanfic.judul}</Card.Title>
                        <Card.Text className="text-muted mb-3">
                          <small>Genre: <span className="badge bg-secondary">{fanfic.Genre}</span></small>
                        </Card.Text>
                        <NavLink to={`/fanfic/${fanfic._id}`} className="btn btn-outline-primary w-100 d-block text-center">
                          Read Story
                        </NavLink>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted h6">No stories posted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileAuthor