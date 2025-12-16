import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import ApiClient from "../../utils/Apiclient"

function AddFanfic() {
    const navigate = useNavigate()

    const [judul, setJudul] = useState("")
    const [Cerita, setCerita] = useState("")
    const [Genre, setGenre] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!judul || !Cerita || !Genre) {
            setError("Semua field wajib diisi")
            return
        }

        try {
            setLoading(true)
            await ApiClient.post("/fanfic", {
                judul,
                Cerita, // SESUAI DATABASE
                Genre   // SESUAI DATABASE
            })

            navigate("/") // balik ke home
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal menambah fanfic")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <NavLink to="/" className="btn btn-outline-secondary">
                    ← Kembali
                </NavLink>
            </div>

            <h2 className="mb-4">✍️ Tambah Fanfic</h2>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                        type="text"
                        className="form-control"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        placeholder="Masukkan judul cerita"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={Genre}
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder="Contoh: Fantasy, Romance"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Cerita</label>
                    <textarea
                        className="form-control"
                        rows={6}
                        value={Cerita}
                        onChange={(e) => setCerita(e.target.value)}
                        placeholder="Tulis ceritamu di sini..."
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Menyimpan..." : "Simpan Fanfic"}
                </button>
            </form>
        </div>
    )
}

export default AddFanfic