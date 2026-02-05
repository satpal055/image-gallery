import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import UserLogin from "../pages/UserLogin"; // 🔥 IMPORTANT

export default function Header() {
  const { user, setUser } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user_uid");
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/" className="text-xl font-bold text-gray-800">
          ImageGallery
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={location.pathname === "/" ? "text-black" : "text-gray-500"}
          >
            Home
          </Link>

          {user && (
            <Link
              to="/liked"
              className={location.pathname === "/liked" ? "text-black" : "text-gray-500"}
            >
              ❤️ Liked
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-gray-800 text-white rounded-full text-sm"
            >
              Logout
            </button>
          ) : (
            <UserLogin />
          )}
        </div>
      </div>
    </header>
  );
}
