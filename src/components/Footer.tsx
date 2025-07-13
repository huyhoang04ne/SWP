import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#6A1B9A] text-white text-sm pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* Logo và slogan */}
        <div className="mb-6">
          <div className="flex justify-center items-center space-x-2 text-2xl font-bold">
            <span className="text-white">⚥</span>
            <span className="text-white">Gender</span>
            <span className="text-green-400">Care</span>
          </div>

          <div className="mt-2 text-sm font-medium">
            HỆ THỐNG CHĂM SÓC SỨC KHỎE GIỚI VÀ TÌNH DỤC TOÀN DIỆN CHO MỌI ĐỐI TƯỢNG – MỌI LỨA TUỔI
          </div>
          <div className="mt-1 text-purple-200 italic text-sm">
            An toàn – Uy tín – Hiện đại – Bảo mật – Hỗ trợ tận tâm 24/7
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="grid grid-cols-1 md:grid-cols-3 text-left gap-8 mt-8">
          <div>
            <h3 className="font-semibold text-yellow-300 mb-2">Hệ thống phía Bắc</h3>
            <ul className="space-y-1 list-disc list-inside text-white/90">
              <li>Hà Nội</li>
              <li>Hải Phòng</li>
              <li>Nam Định</li>
              <li>Thái Nguyên</li>
              <li>Quảng Ninh</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-300 mb-2">Hệ thống miền Trung</h3>
            <ul className="space-y-1 list-disc list-inside text-white/90">
              <li>Đà Nẵng</li>
              <li>Huế</li>
              <li>Quảng Nam</li>
              <li>Nghệ An</li>
              <li>Khánh Hòa</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-300 mb-2">Hệ thống miền Nam</h3>
            <ul className="space-y-1 list-disc list-inside text-white/90">
              <li>TP. Hồ Chí Minh</li>
              <li>Bình Dương</li>
              <li>Long An</li>
              <li>Cần Thơ</li>
              <li>Vũng Tàu</li>
            </ul>
          </div>
        </div>

        {/* Dòng kẻ */}
        <div className="border-t border-white/30 my-6" />

        {/* Chính sách + liên hệ */}
        <div className="text-xs text-white/80 leading-relaxed">
          <p className="mb-2">
            CÔNG TY CỔ PHẦN GENDERCARE VIỆT NAM – Giấy chứng nhận ĐKKD số 0123456789 do Sở KHĐT TP.HCM cấp ngày 01/01/2020.
          </p>
          <p>Địa chỉ: 123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</p>
          <p>Hotline: 028 7102 6595 | Email: support@gendercare.vn</p>
          <p>Chịu trách nhiệm nội dung: Nguyễn Thanh Hằng</p>
          <p>Bản quyền ©2025 thuộc về GenderCare Việt Nam</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
