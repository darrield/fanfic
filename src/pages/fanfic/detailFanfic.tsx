import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import ApiClient from "../../utils/ApiClient"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Alert from "react-bootstrap/Alert"

interface Comment {
  _id: string
  isi: string
  createdby: {
    username: string
  }
  createdAt: string
}

function DetailFanfic() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [fanfic, setFanfic] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [error, setError] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)

  const isLoggedIn = !!localStorage.getItem("AuthToken")

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await ApiClient.get(`/fanfic/${id}`)
        setFanfic(res.data.data)
        setComments(res.data.data.comments || [])
        setIsBookmarked(res.data.isBookmarked || false)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  const handleBookmark = async () => {
  if (!isLoggedIn) {
    navigate("/auth")
    return
  }

  try {
  const res = await ApiClient.post(`/fanfic/${id}/bookmark`)
  setIsBookmarked(res.data.isBookmarked)
  } catch (err) {
    console.error(err)
  }
}

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setCommentLoading(true)
    setError("")
    try {
      const res = await ApiClient.post(`/fanfic/${id}/comment`, { isi: newComment })
      setComments(res.data.data)
      setNewComment("")
    } catch {
      setError("Failed to post comment")
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) return <div className="container my-5 text-center">Loading...</div>
  if (!fanfic) return <div className="container my-5 text-center">Fanfic tidak ditemukan</div>

  return (
    <div className="bg-light min-vh-100">
      <div className="container my-5">
        <Card className="shadow-sm">
          <Card.Body className="p-5">
            <h1>{fanfic.judul}</h1>
            <p className="text-muted">
              By {fanfic.createdby?.username} | Genre: {fanfic.Genre}
            </p>

            <Button
              variant={isBookmarked ? "danger" : "outline-danger"}
              className="mb-4"
              onClick={handleBookmark}
            >
               {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>

            <div style={{ whiteSpace: "pre-wrap" }}>{fanfic.Cerita}</div>

            <hr />

            {!isLoggedIn ? (
              <div className="text-center">
                <Button onClick={() => navigate("/auth")}>
                  Login untuk komentar
                </Button>
              </div>
            ) : (
              <>
                <h4>Comments</h4>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleCommentSubmit} className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button type="submit" className="mt-2" disabled={commentLoading}>
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </Button>
                </Form>

                {comments.map((comment) => (
                  <Card key={comment._id} className="mb-2">
                    <Card.Body>
                      <strong>{comment.createdby.username}</strong>
                      <p>{comment.isi}</p>
                      <small className="text-muted">
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                    </Card.Body>
                  </Card>
                ))}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default DetailFanfic
