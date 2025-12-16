import { useCallback, useEffect, useState } from "react"
import { NavLink } from "react-router"
import ApiClient from "../../utils/Apiclient"

interface Fanfic {
    _id: string
    judul: string
    Cerita: string
    Genre: string
    createdby?: {
        _id: string
        username: string
    }
    comments: any[]
}



function Fanfic() {
    const [fanfic, setFanfic] = useState<Fanfic[]>([])
    const [loading, setLoading] = useState(true)

    const fetchFanfic = useCallback(async () => {
        try {
            const response = await ApiClient.get("/fanfic")
            setFanfic(response.data.data) // SESUAI RESPONSE BACKEND
        } catch (error) {
            console.error("Gagal mengambil data fanfic", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFanfic()
    }, [fetchFanfic])

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📖 Fanfic Forge</h2>
                <NavLink to="/add-fanfic" className="btn btn-primary">
                    ✍️ Tulis Cerita
                </NavLink>
            </div>

            {loading && <p>Loading cerita...</p>}

            {!loading && fanfic.length === 0 && (
                <p>Belum ada cerita.</p>
            )}

            <div className="row">
                {fanfic.map(item => (
                    <div className="col-md-4 mb-4" key={item._id}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{item.judul}</h5>

                                <span className="badge bg-secondary mb-2">
                                    {item.Genre}
                                </span>

                                <p className="card-text mt-2">
                                    {item.Cerita.length > 120
                                        ? item.Cerita.substring(0, 120) + "..."
                                        : item.Cerita}
                                </p>

                                <small className="text-muted">
                                    ✍️{" "}
                                    {item.createdby
                                        ? item.createdby.username
                                        : "Unknown Author"}
                                </small>
                            </div>

                            <div className="card-footer bg-white d-flex justify-content-between">
                                <NavLink
                                    to={`/fanfic/${item._id}`}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    Baca
                                </NavLink>

                                <span className="text-muted">
                                    💬 {item.comments.length}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Fanfic