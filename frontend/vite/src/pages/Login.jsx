import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // 🔑 YAHI SE UID MILTI HAI
        localStorage.setItem(
            "user",
            JSON.stringify({
                uid: user.uid,
                name: user.displayName,
                email: user.email,
            })
        );

        navigate("/");
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <button
                onClick={loginWithGoogle}
                className="px-6 py-3 bg-blue-600 text-white rounded"
            >
                Login with Google
            </button>
        </div>
    );
}
