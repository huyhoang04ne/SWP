import React from "react";

const GenderCare = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">HỆ THỐNG Y TẾ GENDERCARE</h1>
      <div className="w-[270px] h-[3px] bg-purple-800 mb-6"></div>

      {/* 1. Giới thiệu chung */}
      <h2 className="text-xl font-bold text-purple-800 mb-2">1. Giới thiệu hệ thống y tế chuyên biệt về sức khỏe giới tính</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        GenderCare là hệ thống chăm sóc sức khỏe tiên phong tại Việt Nam chuyên sâu về các vấn đề liên quan đến sức khỏe giới tính và bệnh lây truyền qua đường tình dục (STI). Chúng tôi cung cấp dịch vụ xét nghiệm HIV, giang mai, lậu, viêm gan B/C cùng nhiều gói khám tầm soát phù hợp cho từng nhóm đối tượng, từ thanh thiếu niên đến người trưởng thành. Với mạng lưới phòng khám phủ rộng toàn quốc, GenderCare cam kết mang đến sự tiện lợi, chính xác và an toàn tuyệt đối.
      </p>

      {/* 2. Quản lý chu kỳ kinh nguyệt */}
      <h2 className="text-xl font-bold text-purple-800 mb-2">2. Theo dõi chu kỳ kinh nguyệt chính xác, cá nhân hóa</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        GenderCare cung cấp nền tảng theo dõi chu kỳ kinh nguyệt thông minh, hỗ trợ người dùng ghi nhận ngày hành kinh, tính toán độ dài chu kỳ, dự đoán ngày rụng trứng và khoảng thời gian dễ thụ thai. Tính năng này được thiết kế nhằm nâng cao nhận thức về sức khỏe sinh sản, cảnh báo các bất thường, và đồng hành cùng người dùng trong kế hoạch hóa gia đình an toàn. Giao diện trực quan, bảo mật cao, và hoàn toàn miễn phí.
      </p>
      <img src="/Images/chuki.jpg" alt="Theo dõi chu kỳ kinh nguyệt" className="w-full max-w-2xl rounded-md shadow-md mx-auto mt-6" />
      <p className="text-sm italic text-center text-gray-500 mt-2">Nền tảng ghi nhận ngày hành kinh, dự đoán rụng trứng và cảnh báo bất thường.</p>

      {/* 3. Xét nghiệm STIs */}
      <h2 className="text-xl font-bold text-purple-800 mt-10 mb-2">3. Xét nghiệm STIs nhanh chóng và bảo mật</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        GenderCare cam kết cung cấp dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STIs) an toàn, riêng tư và bảo mật. Khách hàng có thể đăng ký các gói xét nghiệm cá nhân hoặc combo với chi phí hợp lý. Quy trình lấy mẫu khép kín, trả kết quả trực tuyến và có hỗ trợ tư vấn miễn phí sau khi nhận kết quả.
      </p>
      <img src="/Images/stilne.jpg" alt="Xét nghiệm STIs" className="w-full max-w-2xl rounded-md shadow-md mx-auto mt-6" />
      <p className="text-sm italic text-center text-gray-500 mt-2">Đăng ký xét nghiệm STIs an toàn, kín đáo với kết quả chính xác.</p>

      {/* 4. Đặt lịch tư vấn viên */}
      <h2 className="text-xl font-bold text-purple-800 mt-10 mb-2">4. Đặt lịch tư vấn viên linh hoạt</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Khách hàng có thể đặt lịch tư vấn với các chuyên gia y tế, tâm lý hoặc bác sĩ qua nền tảng trực tuyến của GenderCare. Hệ thống cho phép chọn thời gian linh hoạt, nhận thông báo nhắc lịch, và đảm bảo cuộc trò chuyện 1:1 diễn ra riêng tư, hiệu quả.
      </p>
      <img src="/Images/tuvanvien.jpg" alt="Tư vấn viên sức khỏe" className="w-full max-w-2xl rounded-md shadow-md mx-auto mt-6" />
      <p className="text-sm italic text-center text-gray-500 mt-2">Chọn giờ linh hoạt, tư vấn riêng tư với chuyên gia sức khỏe giới tính.</p>

      {/* 5. Cơ sở vật chất */}
      <h2 className="text-xl font-bold text-purple-800 mt-10 mb-2">5. Cơ sở vật chất hiện đại và thân thiện</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Các phòng khám GenderCare được xây dựng hiện đại, thân thiện, đầy đủ tiện nghi từ khu tiếp đón đến phòng tư vấn và phòng xét nghiệm. Không gian riêng tư, sạch sẽ giúp khách hàng cảm thấy thoải mái và yên tâm khi sử dụng dịch vụ.
      </p>
      <img src="/Images/cosovatchat.jpg" alt="Phòng khám hiện đại" className="w-full max-w-2xl rounded-md shadow-md mx-auto mt-6" />
      <p className="text-sm italic text-center text-gray-500 mt-2">Không gian sạch sẽ, tiện nghi và riêng tư dành cho mọi khách hàng.</p>

      {/* 6. Đội ngũ chuyên gia */}
      <h2 className="text-xl font-bold text-purple-800 mt-10 mb-2">6. Đội ngũ chuyên gia y tế chuyên sâu</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        GenderCare hội tụ đội ngũ y bác sĩ có nhiều năm kinh nghiệm, được đào tạo bài bản và liên tục cập nhật chuyên môn trong lĩnh vực STI, sức khỏe giới tính và tư vấn tâm lý. Chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao, đồng hành cùng từng khách hàng.
      </p>
      <img src="/Images/doingugioi.jpg" alt="Đội ngũ chuyên gia" className="w-full max-w-2xl rounded-md shadow-md mx-auto mt-6" />
      <p className="text-sm italic text-center text-gray-500 mt-2">Đội ngũ chuyên gia tận tâm, giàu kinh nghiệm, sẵn sàng hỗ trợ bạn.</p>

      {/* 7. Chính sách hỗ trợ */}
      <h2 className="text-xl font-bold text-purple-800 mt-10 mb-2">7. Chính sách hỗ trợ cộng đồng và ưu đãi định kỳ</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        GenderCare triển khai nhiều chương trình ưu đãi định kỳ như giảm giá cho sinh viên, gói khám cặp đôi, combo định kỳ, tặng gói tư vấn miễn phí và hỗ trợ cộng đồng LGBT+. Đồng thời, hệ thống hỗ trợ thanh toán trả góp, kết quả nhận online và bảo mật hoàn toàn.
      </p>
    </div>
  );
};

export default GenderCare;
