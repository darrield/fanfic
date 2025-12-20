import { useEffect, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router"
import ApiClient from "../../utils/ApiClient"
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert"

function EditFanfic() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [judul, setJudul] = useState("")
    const [Cerita, setCerita] = useState("")
    const [Genre, setGenre] = useState("")
    
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await ApiClient.get(`/fanfic/${id}`)
                const data = res.data.data
                
                setJudul(data.judul)
                setCerita(data.Cerita)
                setGenre(data.Genre)
            } catch (err: any) {
                console.error(err)
                setError("Gagal mengambil data cerita. Mungkin cerita tidak ada.")
            } finally {
                setLoading(false)
            }
        }
        fetchStory()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!judul || !Cerita || !Genre) {
            setError("Semua field wajib diisi")
            return
        }

        try {
            setSubmitting(true)
            // Use PUT to update
            await ApiClient.put(`/fanfic/${id}`, {
                judul,
                Cerita,
                Genre
            })

            navigate("/profile") 
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal mengupdate fanfic")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <Spinner animation="border" />
            </div>
        )
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <NavLink to="/profile" className="btn btn-outline-secondary">
                    ← Batal
                </NavLink>
            </div>

            <h2 className="mb-4">✏️ Edit Fanfic</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                        type="text"
                        className="form-control"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={Genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Cerita</label>
                    <textarea
                        className="form-control"
                        rows={10}
                        value={Cerita}
                        onChange={(e) => setCerita(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={submitting}
                >
                    {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </form>
        </div>
    )
}

export default EditFanfic