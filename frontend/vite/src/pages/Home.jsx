import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
    const [images, setImages] = useState([]);
    const { user } = useAuth();   // 👍 NOW user IS AVAILABLE

    useEffect(() => {
        axios
            .get(`${API_URL}/api/images`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setImages(res.data);
                } else {
                    setImages([]);
                }
            })
            .catch(() => setImages([]));
    }, []);

    const handleLike = async (imageId) => {
        // ❌ BLOCK LIKE IF NO LOGIN
        if (!user) {
            alert("Login with Google first");
            return;
        }

        // 👍 Firebase token lajmi
        const token = await auth.currentUser.getIdToken();

        await axios.post(
            `${API_URL}/api/images/${imageId}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // UI update
        setImages((prev) =>
            prev.map((img) =>
                img._id === imageId
                    ? {
                        ...img,
                        likes: img.likes.includes(user.uid)
                            ? img.likes.filter((id) => id !== user.uid)
                            : [...img.likes, user.uid],
                    }
                    : img
            )
        );
    };

    return (
        <div className="px-6 py-8 bg-gray-50 min-h-screen mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Image Gallery
            </h2>

            {images.length === 0 && (
                <p className="text-center text-gray-500">No images found</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {images.map((img) => {
                    const liked = user && img.likes.includes(user.uid);

                    return (
                        <div key={img._id} className="group relative bg-black rounded-xl overflow-hidden shadow-md">
                            <div className="relative w-full aspect-[2/3]">
                                <img src={img.imageUrl} alt={img.title} className="absolute inset-0 w-full h-full object-cover" />

                                <div className="absolute bottom-0 w-full p-3">
                                    <h4 className="text-sm text-white truncate">{img.title}</h4>

                                    <button
                                        onClick={() => handleLike(img._id)}
                                        className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium 
                                            ${liked ? "bg-red-600 text-white" : "bg-white/80 text-gray-800"}`}
                                    >
                                        ❤️ {img.likes.length}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
