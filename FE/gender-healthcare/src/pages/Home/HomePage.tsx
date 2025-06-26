import React from 'react';
import { Link } from 'react-router-dom';
import banner1 from '../../assets/gender_care_clinic_hero.jpg';
import Header from '../../components/header';
// ❌ Đã xoá: import Navbar
import Footer from '../../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      {/* ❌ Đã xoá: <Navbar /> */}

      <section className="bg-gradient-to-r from-purple-100 via-pink-50 to-green-100 py-14">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 leading-tight">
              Chăm sóc sức khỏe giới tính <br /> cho mọi lứa tuổi
            </h1>
            <p className="text-gray-700 text-lg">
              GenderCare đồng hành cùng bạn và gia đình trên hành trình xây dựng sức khỏe tinh thần, thể chất và giới tính an toàn, đúng đắn, nhân văn.
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

      <main className="flex-grow max-w-7xl mx-auto p-6 space-y-10">
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
                to="/bai-viet/1"
                className="text-purple-600 hover:underline mt-3 inline-block text-sm"
              >
                Xem chi tiết →
              </Link>
            </article>
          ))}
        </div>
      </main>

      <Footer />
      <div className="flex justify-center py-4">
        <a href="#top" className="text-purple-600 hover:underline">
          ↑ Back to top
        </a>
      </div>
    </div>
  );
};

export default HomePage;
