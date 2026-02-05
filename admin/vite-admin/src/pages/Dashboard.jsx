import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // 🔥 edit states
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const fileInputRef = useRef(null);
    const token = localStorage.getItem("token");

    /* ================= FETCH IMAGES ================= */
    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/images`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setImages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= UPLOAD IMAGE (UNCHANGED LOGIC) ================= */
    const uploadImage = async () => {
        if (!title || !image) return;

        if (image.size > 10 * 1024 * 1024) {
            alert("Image must be less than 10MB");
            return;
        }

        setLoading(true);
        setSuccess(false);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);

        try {
            await axios.post(`${API_URL}/api/images`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess(true);
            setTitle("");
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            fetchImages();

            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= EDIT FLOW ================= */
    const startEdit = (img) => {
        setEditingId(img._id);
        setEditTitle(img.title);
    };

    const saveEdit = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/images/${id}`,
                { title: editTitle },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setImages((prev) =>
                prev.map((img) =>
                    img._id === id ? { ...img, title: editTitle } : img
                )
            );

            setEditingId(null);
            setEditTitle("");
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= DELETE IMAGE ================= */
    const deleteImage = async (id) => {
        if (!window.confirm("Delete this image?")) return;

        try {
            await axios.delete(`${API_URL}/api/images/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setImages((prev) => prev.filter((img) => img._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            <div className="max-w-6xl mx-auto">

                {/* ================= UPLOAD CARD ================= */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        Upload Image
                    </h2>

                    {success && (
                        <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-center">
                            ✅ Image uploaded successfully
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Image Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Select Image
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full text-sm text-gray-600
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-600
                            hover:file:bg-indigo-100"
                        />
                    </div>

                    <button
                        onClick={uploadImage}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold text-lg transition
                        ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                            }`}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>

                {/* ================= IMAGE LIST ================= */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Uploaded Images
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img) => (
                        <div
                            key={img._id}
                            className="bg-white rounded-xl shadow p-4"
                        >
                            <img
                                src={img.imageUrl}
                                alt=""
                                className="w-full h-48 object-cover rounded-lg"
                            />

                            {/* TITLE */}
                            {editingId === img._id ? (
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full mt-3 px-3 py-2 border rounded-lg"
                                />
                            ) : (
                                <p className="mt-3 font-medium text-gray-800 truncate">
                                    {img.title}
                                </p>
                            )}

                            {/* ACTIONS */}
                            <div className="flex gap-3 mt-3">
                                {editingId === img._id ? (
                                    <>
                                        <button
                                            onClick={() => saveEdit(img._id)}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditTitle("");
                                            }}
                                            className="flex-1 bg-gray-400 text-white py-2 rounded-lg text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(img)}
                                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteImage(img._id)}
                                            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
