import React from "react";
import Navbar from "./navbar"; // nếu bạn dùng tên thường
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6">
        <Outlet /> {/* nơi render các route con */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
