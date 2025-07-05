import React from 'react';

const services = [
  {
    name: 'Xét nghiệm HIV nhanh',
    description: 'Kiểm tra kháng thể HIV bằng test nhanh.',
    price: '120,000 VND',
    category: 'HIV',
    status: 'Đang áp dụng',
  },
  {
    name: 'Xét nghiệm HIV ELISA',
    description: 'Khẳng định HIV bằng phương pháp ELISA.',
    price: '300,000 VND',
    category: 'HIV',
    status: 'Đang áp dụng',
  },
  {
    name: 'Tải lượng HIV (Viral Load)',
    description: 'Xét nghiệm RNA HIV trong máu.',
    price: '900,000 VND',
    category: 'HIV',
    status: 'Tạm ngừng',
  },
  {
    name: 'PCR Lậu',
    description: 'Phát hiện DNA vi khuẩn lậu qua nước tiểu.',
    price: '550,000 VND',
    category: 'Lậu',
    status: 'Đang áp dụng',
  },
  {
    name: 'Soi dịch niệu đạo',
    description: 'Nhuộm Gram soi tươi phát hiện lậu.',
    price: '300,000 VND',
    category: 'Lậu',
    status: 'Đang áp dụng',
  },
  {
    name: 'Cấy vi khuẩn Lậu',
    description: 'Nuôi cấy vi khuẩn để định danh.',
    price: '700,000 VND',
    category: 'Lậu',
    status: 'Tạm ngừng',
  },
  {
    name: 'RPR định tính',
    description: 'Phát hiện kháng thể giang mai không đặc hiệu.',
    price: '150,000 VND',
    category: 'Giang mai',
    status: 'Đang áp dụng',
  },
  {
    name: 'TPHA định tính',
    description: 'Xét nghiệm kháng thể đặc hiệu giang mai.',
    price: '350,000 VND',
    category: 'Giang mai',
    status: 'Đang áp dụng',
  },
  {
    name: 'RPR định lượng',
    description: 'Theo dõi hiệu quả điều trị giang mai.',
    price: '250,000 VND',
    category: 'Giang mai',
    status: 'Tạm ngừng',
  },
  {
    name: 'Combo HIV–Lậu–Giang mai',
    description: 'Gói tổng hợp 3 xét nghiệm chính.',
    price: '800,000 VND',
    category: 'Combo',
    status: 'Đang áp dụng',
  },
  {
    name: 'Tầm soát STI tổng quát',
    description: 'Bao gồm HIV, Lậu, Giang mai, viêm gan.',
    price: '1,200,000 VND',
    category: 'Combo',
    status: 'Đang áp dụng',
  },
  {
    name: 'Gói dành cho người có nguy cơ cao',
    description: 'Dành cho người có hành vi nguy cơ.',
    price: '900,000 VND',
    category: 'Combo',
    status: 'Đang áp dụng',
  },
  {
    name: 'Xét nghiệm Chlamydia',
    description: 'PCR phát hiện Chlamydia trachomatis.',
    price: '450,000 VND',
    category: 'Khác',
    status: 'Đang áp dụng',
  },
  {
    name: 'Tư vấn trước xét nghiệm',
    description: 'Giải thích và tư vấn chỉ định dịch vụ.',
    price: '150,000 VND',
    category: 'Tư vấn',
    status: 'Đang áp dụng',
  },
  {
    name: 'Khám tổng quát ban đầu',
    description: 'Khám sàng lọc trước chỉ định.',
    price: '300,000 VND',
    category: 'Tư vấn',
    status: 'Đang áp dụng',
  },
];

const Pricing = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-[15px] leading-relaxed">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-6">Bảng giá dịch vụ GenderCare</h1>

      <div className="w-[120px] h-[3px] bg-purple-800 mb-4"></div>
      <p className="text-gray-700 mb-6">
        Bảng giá dịch vụ xét nghiệm các bệnh lây truyền qua đường tình dục (STIs) tại GenderCare được cập nhật thường xuyên, minh bạch và rõ ràng trên toàn hệ thống. Mọi thông tin đều được bảo mật tuyệt đối và tuân thủ theo tiêu chuẩn y tế quốc tế.
      </p>

      <div className="overflow-x-auto shadow border rounded-lg mb-6">
        <table className="w-full table-auto text-left text-[15px]">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="px-4 py-3 border">STT</th>
              <th className="px-4 py-3 border">Dịch vụ</th>
              <th className="px-4 py-3 border">Mô tả</th>
              <th className="px-4 py-3 border">Giá</th>
              <th className="px-4 py-3 border">Phân loại</th>
              <th className="px-4 py-3 border">Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 border">{index + 1}</td>
                <td className="px-4 py-3 border">{service.name}</td>
                <td className="px-4 py-3 border">{service.description}</td>
                <td className="px-4 py-3 border text-red-600 font-semibold">{service.price}</td>
                <td className="px-4 py-3 border italic">{service.category}</td>
                <td className="px-4 py-3 border">{service.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="italic text-sm text-gray-600 mb-4">
        (*) Để kiểm tra tình trạng gói xét nghiệm, xin vui lòng liên hệ Hotline <strong>039.204.2850</strong>.
      </p>

      <div className="space-y-4 text-[16px] text-gray-800">
        <p><strong>1. Bảng giá áp dụng trên toàn hệ thống GenderCare từ ngày 01/04/2025</strong></p>

        <p>
          <strong>2. Giá dịch vụ tại GenderCare đã bao gồm:</strong> tư vấn trước và sau xét nghiệm, bảo mật thông tin khách hàng tuyệt đối, hỗ trợ chăm sóc từ xa qua tổng đài và nền tảng online, in kết quả miễn phí, không thu thêm phụ phí nếu có phản ứng hoặc tái khám trong vòng 7 ngày.
        </p>

        <p>
          <strong>3. GenderCare miễn phí giữ lịch và kết quả trong 5 tuần</strong> kể từ ngày xét nghiệm, khách hàng có thể đặt hẹn lại mà không phải xét nghiệm lại, trừ khi có thay đổi chỉ định từ bác sĩ chuyên môn.
        </p>

        <p>
          <strong>4. GenderCare miễn phí lưu trữ dữ liệu và đồng bộ đa nền tảng:</strong> khách hàng có thể tra cứu kết quả qua app, email, hoặc trực tiếp tại cơ sở bất kỳ trong hệ thống.
        </p>

        <div>
          <p><strong>5. Các tiện ích kèm theo khi sử dụng dịch vụ tại GenderCare:</strong></p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Miễn phí wifi, nước uống, phòng đợi riêng tư</li>
            <li>Hệ thống tiếp đón thân thiện, không phân biệt đối tượng</li>
            <li>Không gian tư vấn riêng đảm bảo kín đáo và tâm lý thoải mái</li>
            <li>Dịch vụ chăm sóc cá nhân: nhắc lịch xét nghiệm định kỳ, hỗ trợ gọi điện tư vấn sức khỏe</li>
            <li>Miễn phí gửi xe tại tất cả các cơ sở</li>
            <li>Khách hàng có thể đăng ký kiểm tra thêm các bệnh khác như viêm gan, Chlamydia, HPV...</li>
            <li>Lưu trữ hồ sơ và kết quả xét nghiệm trọn đời hoàn toàn miễn phí</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
