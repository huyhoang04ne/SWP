import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import banner1 from '../../assets/gender_care_clinic_hero.jpg';
import Header from '../../components/header'; // 

const HomePage: React.FC = () => {
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    let role = localStorage.getItem("userRole");
    let roles: string[] = [];
    try {
      roles = role ? JSON.parse(role) : [];
    } catch {
      if (role) roles = [role];
    }
    setIsManager(roles.includes("Manager"));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      {/* Navbar luôn hiện */}
      <Header />   
      <Navbar />

      {/* Nút quay lại trang manager */}
      {isManager && (
        <div className="flex justify-end p-4">
          <button
            onClick={() => navigate("/manager")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
          >
            📋 Quay lại Quản lý phân ca tư vấn viên
          </button>
        </div>
      )}

      {/* Nội dung chính */}
      <main className="flex-grow">
        {/* Hero Section chỉ hiển thị ở trang chủ */}
        {isHome && (
          <section className="bg-gradient-to-r from-purple-100 via-pink-50 to-green-100 py-14">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 leading-tight">
                  Chăm sóc sức khỏe giới tính <br /> cho mọi lứa tuổi
                </h1>
                <p className="text-gray-700 text-lg">
                  GenderCare đồng hành cùng bạn và gia đình trên hành trình xây dựng sức khỏe tinh thần,
                  thể chất và giới tính an toàn, đúng đắn, nhân văn.
                </p>
                <Link
                  to="/dich-vu"
                  className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                >
                  Khám phá dịch vụ
                </Link>
              </div>
              <img
                src={banner1}
                alt="GenderCare Hero"
                className="w-full max-h-96 object-contain rounded-lg shadow-lg"
              />
            </div>
          </section>
        )}

        {/* Nếu là trang chủ, hiển thị bài viết nổi bật; nếu không thì hiển thị các route con */}
        {isHome ? (
          <section className="max-w-7xl mx-auto p-6 space-y-10">
            <h2 className="text-2xl font-bold text-purple-700 text-center">Bài viết nổi bật</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <article
                  key={i}
                  className="bg-white rounded-xl p-5 shadow hover:shadow-md transition border"
                >
                  <h3 className="text-lg font-bold text-purple-800">📌 Tiêu đề bài viết {i + 1}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Mô tả ngắn giúp người đọc nắm bắt nội dung bài viết một cách nhanh chóng và dễ hiểu.
                  </p>
                  <Link
                    to={`/bai-viet/${i + 1}`}
                    className="text-purple-600 hover:underline mt-3 inline-block text-sm"
                  >
                    Xem chi tiết →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Footer và Back to top */}
      <Footer />
     
    </div>
  );
};

export default HomePage;
