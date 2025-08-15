// Layout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const Layout = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Sidebar state

  if (authLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navbar */}
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content + Footer */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        }`}
      >
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
