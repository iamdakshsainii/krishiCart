import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const Layout = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);

  if (authLoading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main Content + Footer */}
      <div className="flex flex-col flex-1 ml-0 md:ml-64 transition-all duration-300">
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
