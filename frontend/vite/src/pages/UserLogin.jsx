import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserLogin() {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // backend me save
      await axios.post(`${API_URL}/api/users/save`, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
    } catch (err) {
      alert("Google login failed");
      console.error(err);
    }
  };

  return (
    <button
      onClick={loginWithGoogle}
      className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium"
    >
      Login with Google
    </button>
  );
}
