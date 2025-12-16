import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import ApiClient from "../../utils/ApiClient"

export default function DetailFanfic() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [fanfic, setFanfic] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await ApiClient.get(`/public/fanfic/${id}`)
        setFanfic(res.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!fanfic) return <p>Fanfic tidak ditemukan</p>

  return (
    <div>
      <h2>{fanfic.judul}</h2>
      <p>{fanfic.Cerita}</p>

      <button onClick={() => navigate("/login")}>
        Login untuk komentar / bookmark
      </button>
    </div>
  )
}
