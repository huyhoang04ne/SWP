import React from "react";
import PeriodCalendarPage from "../PeriodCalendar/PeriodCalendarPage";

const CycleTracking: React.FC = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen font-[Segoe_UI]">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 text-center">
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <div className="text-3xl text-purple-600">⚥</div>
            <div className="text-2xl font-bold text-gray-800">
              Gender<span className="text-green-600">Care</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-600">
            HỆ THỐNG TRUNG TÂM CHĂM SÓC SỨC KHỎE GIỚI TÍNH CHO TRẺ EM & NGƯỜI LỚN
          </div>
          <div className="text-sm text-purple-600 font-medium">
            AN TOÀN – UY TÍN – CHẤT LƯỢNG HÀNG ĐẦU VIỆT NAM
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-purple-50 border-t border-b border-purple-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-start relative">
          <ul className="flex space-x-6 text-sm font-semibold text-purple-800 relative">
            <li><a href="#" className="hover:text-purple-600">Trang chủ</a></li>
            <li className="relative group">
              <button className="hover:text-purple-600">Giới thiệu</button>
              <ul className="absolute left-0 mt-2 bg-white shadow rounded-lg py-2 min-w-[160px] z-20 hidden group-hover:block">
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Diễn đàn</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Chuyên gia</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Tuyển dụng</a></li>
              </ul>
            </li>
            <li className="relative group">
              <button className="text-white bg-purple-600 px-3 py-1 rounded-md">Dịch vụ</button>
              <ul className="absolute left-0 mt-2 bg-white shadow rounded-lg py-2 min-w-[180px] z-20 hidden group-hover:block">
                <li><a href="#" className="block px-4 py-2 bg-purple-100 font-bold text-purple-800">Chu kì kinh nguyệt</a></li>
                <li className="relative group">
                  <button className="block px-4 py-2 w-full text-left hover:bg-purple-100">Xét nghiệm STIs</button>
                  <ul className="absolute left-full top-0 bg-white shadow rounded-lg py-2 min-w-[140px] z-30 hidden group-hover:block">
                    <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Giang mai</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">HIV</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Lậu</a></li>
                  </ul>
                </li>
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Tư vấn</a></li>
              </ul>
            </li>
            <li><a href="#" className="hover:text-purple-600">Cẩm nang</a></li>
            <li><a href="#" className="hover:text-purple-600">Bảng giá</a></li>
            <li><a href="#" className="hover:text-purple-600">Bệnh học</a></li>
            <li><a href="#" className="hover:text-purple-600">Tin tức</a></li>
          </ul>

          <div className="flex space-x-4 text-xl text-purple-700">
            <div className="relative group">
              <button title="Thông báo" className="hover:text-purple-500">🔔</button>
              <ul className="absolute right-0 mt-2 bg-white shadow rounded-lg py-2 min-w-[200px] z-20 hidden group-hover:block">
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Xét nghiệm STIs</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Tư vấn</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Xem Chu kì kinh nguyệt</a></li>
              </ul>
            </div>
            <button title="Tìm kiếm" className="hover:text-purple-500">🔍</button>
            <div className="relative group">
              <button title="Tài khoản" className="hover:text-purple-500">👤</button>
              <ul className="absolute right-0 mt-2 bg-white shadow rounded-lg py-2 min-w-[180px] z-20 hidden group-hover:block">
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Tài khoản của tôi</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-purple-100">Đăng xuất</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto p-6 space-y-8">
        <PeriodCalendarPage />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t text-sm text-gray-600 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="text-xl text-purple-600">⚥</div>
            <div className="font-bold text-gray-800">
              Gender<span className="text-green-600">Care</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            Địa chỉ: ...
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CycleTracking;