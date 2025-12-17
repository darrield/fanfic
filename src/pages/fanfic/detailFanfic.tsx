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

  const isLoggedIn = !!localStorage.getItem("AuthToken")

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await ApiClient.get(`/public/fanfic/${id}`)
        setFanfic(res.data.data)
        if (isLoggedIn) {
          setComments(res.data.data.comments || [])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id, isLoggedIn])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setCommentLoading(true)
    setError("")
    try {
      const res = await ApiClient.post(`/fanfic/${id}/comment`, { isi: newComment })
      setComments(res.data.data)
      setNewComment("")
    } catch (error) {
      setError("Failed to post comment")
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) return <div className="container my-5 text-center"><p>Loading...</p></div>
  if (!fanfic) return <div className="container my-5 text-center"><p>Fanfic tidak ditemukan</p></div>

  return (
    <div className="bg-light min-vh-100">
      <div className="container my-5">
        <Card className="shadow-sm">
          <Card.Body className="p-5">
            <h1 className="mb-3">{fanfic.judul}</h1>
            <p className="text-muted mb-4">By {fanfic.createdby?.username} | Genre: {fanfic.Genre}</p>
            <div className="mb-4" style={{ whiteSpace: 'pre-wrap' }}>
              {fanfic.Cerita}
            </div>

            {!isLoggedIn ? (
              <div className="text-center">
                <Button variant="primary" onClick={() => navigate("/auth")}>
                  Login untuk komentar / bookmark
                </Button>
              </div>
            ) : (
              <div>
                <hr />
                <h3 className="mb-3">Comments</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleCommentSubmit} className="mb-4">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="mt-2" disabled={commentLoading}>
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </Button>
                </Form>

                <div>
                  {comments.length === 0 ? (
                    <p className="text-muted">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment) => (
                      <Card key={comment._id} className="mb-3">
                        <Card.Body>
                          <p className="mb-1">
                            <strong>{comment.createdby.username}:</strong> {comment.isi}
                          </p>
                          <small className="text-muted">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </small>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default DetailFanfic
