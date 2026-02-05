import { useEffect, useState } from "react";
import axios from "axios";
// import UserLogin from "./UserLogin";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
    const [images, setImages] = useState([]);

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
            .catch((err) => {
                console.error("API ERROR 👉", err);
                setImages([]);
            });
    }, []);

    const handleLike = async (imageId) => {
        const userId = localStorage.getItem("user_uid");

        // ❌ BLOCK IF LOGGED OUT
        if (!userId) {
            alert("Login with Google first");
            return;
        }

        await axios.post(`${API_URL}/api/images/${imageId}/like`, {
            userId,
        });

        setImages((prev) =>
            prev.map((img) =>
                img._id === imageId
                    ? {
                        ...img,
                        likes: img.likes?.includes(userId)
                            ? img.likes.filter((id) => id !== userId)
                            : [...img.likes, userId],
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
                <p className="text-center text-gray-500">
                    No images found
                </p>
            )}

            {/* CARD GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {images.map((img) => {
                    const userId = localStorage.getItem("user_uid");
                    const liked = img.likes?.includes(userId);

                    return (
                        <div
                            key={img._id}
                            className="group relative bg-black rounded-xl overflow-hidden shadow-md"
                        >
                            {/* Aspect Ratio */}
                            <div className="relative w-full aspect-[2/3]">
                                <img
                                    src={img.imageUrl}
                                    alt={img.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                {/* Bottom content */}
                                <div className="absolute bottom-0 w-full p-3">
                                    <h4 className="text-sm font-semibold text-white truncate">
                                        {img.title}
                                    </h4>

                                    <button
                                        onClick={() => handleLike(img._id)}
                                        className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition
    ${liked
                                                ? "bg-red-600 text-white"
                                                : "bg-white/80 text-gray-800 hover:bg-white"
                                            }`}
                                    >
                                        ❤️ {img.likes.length || 0}
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
