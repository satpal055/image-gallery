import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LikedImages from "./pages/LikedImages";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ✅ HEADER MUST BE HERE */}
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/liked" element={<LikedImages />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
