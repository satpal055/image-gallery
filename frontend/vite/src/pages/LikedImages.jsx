import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function LikedImages() {
    const { user } = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        axios.get(`${API_URL}/api/images`)
            .then((res) => {
                const likedImages = res.data.filter((img) =>
                    img.likes?.includes(user.uid)
                );
                setImages(likedImages);
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) {
        return (
            <div className="pt-24 text-center text-gray-600">
                Please login to see liked images
            </div>
        );
    }

    return (
        <div className="pt-24 px-6 py-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-8">
                ❤️ Liked Images
            </h2>

            {loading && <p className="text-center">Loading…</p>}

            {!loading && images.length === 0 && (
                <p className="text-center text-gray-500">
                    No liked images found
                </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {images.map((img) => (
                    <div
                        key={img._id}
                        className="bg-black rounded-xl overflow-hidden shadow"
                    >
                        <img
                            src={img.imageUrl}
                            alt={img.title}
                            className="w-full h-[260px] object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
