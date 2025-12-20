import { useEffect, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router"
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

  // Load follow status from localStorage
  const loadFollowStatus = (authorId: string, userId: string) => {
    const followedAuthors = JSON.parse(localStorage.getItem('followedAuthors') || '[]')
    const isUserFollowing = followedAuthors.includes(authorId)
    setIsFollowing(isUserFollowing)
    
    // Set follower count based on follow status (approximate)
    setUser(prevUser => {
      if (!prevUser) return prevUser
      const count = isUserFollowing ? 1 : 0
      const followers = Array(count).fill({}).map((_, i) => ({ _id: `follower_${i}`, username: `Follower ${i+1}` }))
      return {
        ...prevUser,
        followers
      }
    })
  }

  const handleToggleFollow = () => {
    if (!user || !currentUserId || followLoading) return

    setFollowLoading(true)
    ApiClient.post(`/follow/${user._id}`)
      .then(response => {
        const nowFollowing = response.data.isFollowing
        setIsFollowing(nowFollowing)
        
        // Save to localStorage
        const followedAuthors = JSON.parse(localStorage.getItem('followedAuthors') || '[]')
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
        localStorage.setItem('followedAuthors', JSON.stringify(followedAuthors))
        
        // Update follower count optimistically
        setUser(prevUser => {
          if (!prevUser) return prevUser
          const currentCount = prevUser.followers?.length || 0
          const newCount = nowFollowing ? currentCount + 1 : Math.max(0, currentCount - 1)
          
          // Create array with new length
          const newFollowers = Array(newCount).fill({}).map((_, i) => ({ _id: `temp_${i}`, username: `User ${i+1}` }))
          
          return {
            ...prevUser,
            followers: newFollowers
          }
        })
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

    // Get current user id
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

    // Fetch fanfics first
    ApiClient.get('/public/fanfic')
      .then(response => {
        const allFanfics = response.data.data || []
        const authorFanfics = allFanfics.filter((fanfic: any) => fanfic.createdby?.username === username)
        setFanfics(authorFanfics)

        // Set user data from fanfics
        if (authorFanfics.length > 0) {
          const authorData = authorFanfics[0].createdby
          setUser({
            _id: authorData._id,
            username: authorData.username,
            followers: [],
            following: []
          })

          // Load follow status from localStorage
          if (userId && authorData._id !== userId) {
            loadFollowStatus(authorData._id, userId)
          }
        } else {
          // No fanfics found
          setUser({
            _id: 'unknown',
            username,
            followers: [],
            following: []
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
              
              {/* Avatar */}
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 100, height: 100, fontSize: 36 }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* Username */}
              <h4 className="mb-1">{user.username}</h4>
              <p className="text-muted mb-3">Penulis di Fanfic Forge</p>

              {/* Follow Stats */}
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

              {/* Follow Button */}
              {currentUserId && user._id !== currentUserId && user._id !== 'unknown' && (
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

              {/* Action */}
              <div className="d-grid gap-2">
                <NavLink to="/" className="btn btn-outline-secondary">
                  Kembali ke Home
                </NavLink>
              </div>

            </div>
          </div>

          {/* Fanfics Section */}
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