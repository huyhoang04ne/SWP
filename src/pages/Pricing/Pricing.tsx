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
      <div className="w-[120px] h-[3px] bg-purple-800 mb-6"></div>

      <h2 className="text-2xl font-bold text-purple-800 mb-3">Các dịch vụ xét nghiệm tại GenderCare</h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-6">
        <li>Xét nghiệm lẻ tất cả các loại.</li>
        <li>Gói xét nghiệm theo độ tuổi hoặc nhu cầu cá nhân hoá.</li>
        <li>Đặt giữ lịch xét nghiệm theo yêu cầu.</li>
        <li>Hỗ trợ xét nghiệm theo nhóm, cơ quan hoặc tổ chức.</li>
      </ul>

      <h2 className="text-2xl font-bold text-purple-800 mb-3">Dịch vụ xét nghiệm lẻ</h2>
      <p className="mb-6 text-gray-700">
        GenderCare là hệ thống cung cấp đầy đủ các loại xét nghiệm cho người lớn và trẻ em, kể cả các loại thường khan hiếm. Với mức giá ổn định, dịch vụ chuyên nghiệp, khách hàng hoàn toàn yên tâm về chất lượng. GenderCare hợp tác cùng các trung tâm, phòng xét nghiệm và nhà cung cấp uy tín trong và ngoài nước nhằm đảm bảo độ chính xác và an toàn cao nhất cho khách hàng.
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
      
          <img
       src="/Images/stls.jpg"
  alt="Phòng xét nghiệm hiện đại"
  className="w-full max-w-3xl rounded-md shadow-md mx-auto mb-2"
/>

      <h2 className="text-2xl font-bold text-purple-800 mt-10 mb-4">Dịch vụ Tiêm Chủng và Tư Vấn Lưu Động</h2>
      <p className="mb-4">GenderCare mang đến dịch vụ tiêm chủng và tư vấn lưu động toàn diện, hỗ trợ tổ chức tiêm tại nhà hoặc tại cơ quan dành cho cá nhân, tổ chức, doanh nghiệp, trường học... Chúng tôi xây dựng quy trình khoa học, đảm bảo y tế và tiết kiệm thời gian tối đa.</p>
      <p className="mb-4">Đội ngũ y bác sĩ chuyên môn cao, quy trình tiêm nhanh chóng, bảo mật thông tin tuyệt đối. Các chương trình hỗ trợ được cá nhân hóa theo từng nhóm đối tượng để tối ưu hiệu quả phòng bệnh và quản lý sức khỏe.</p>

      <h2 className="text-2xl font-bold text-purple-800 mt-10 mb-4">Các Hình Thức Thanh Toán tại GenderCare</h2>
      <p className="mb-4">GenderCare áp dụng nhiều hình thức thanh toán linh hoạt giúp khách hàng dễ dàng sử dụng dịch vụ mà không lo ngại vấn đề tài chính:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Thanh toán bằng tiền mặt tại cơ sở</li>
        <li>Quẹt thẻ ATM, Visa, MasterCard qua máy POS</li>
        <li>Sử dụng ví điện tử: Momo, ZaloPay, VNPAY, Apple Pay,...</li>
        <li>Thanh toán trả góp qua đối tác tài chính như MCredit không lãi suất</li>
        <li>Thanh toán trực tuyến qua website GenderCare</li>
      </ul>
      <p className="mb-4">Mọi thông tin thanh toán đều được xác minh an toàn và minh bạch, đảm bảo trải nghiệm nhanh chóng – thuận tiện.</p>

      <h2 className="text-2xl font-bold text-purple-800 mt-10 mb-4">Gói Tiêm Chủng Trả Góp – Không Lãi Suất</h2>
      <p className="mb-4">GenderCare triển khai chương trình trả góp 0% lãi suất dành cho các gói tiêm chủng có giá trị từ 3.000.000 VND trở lên. Kỳ hạn linh hoạt 6 đến 12 tháng, giúp khách hàng dễ dàng tiếp cận dịch vụ mà không cần thanh toán một lần.</p>
      <p className="mb-4">Chương trình áp dụng với thủ tục đơn giản, phê duyệt nhanh, không yêu cầu chứng minh tài chính phức tạp. Đây là giải pháp tài chính y tế hiệu quả cho gia đình và cá nhân có kế hoạch tiêm chủng dài hạn.</p>

      <h2 className="text-2xl font-bold text-purple-800 mt-10 mb-4">Một Số Gói Dịch Vụ Tiêu Biểu</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Gói tầm soát sức khỏe toàn diện định kỳ</li>
        <li>Gói tiêm phòng HPV, viêm gan B, uốn ván</li>
        <li>Gói dành cho phụ nữ chuẩn bị mang thai và sau sinh</li>
        <li>Gói xét nghiệm cho người có nguy cơ cao (STI, HIV, Chlamydia...)</li>
        <li>Gói tiêm chủng cho người lớn tuổi và người mắc bệnh nền</li>
      </ul>

      <h2 className="text-2xl font-bold text-purple-800 mt-10 mb-4">Hỗ Trợ & Tư Vấn</h2>
      <p className="mb-2">GenderCare phục vụ tất cả các ngày trong tuần từ 7h30 - 17h30, kể cả thứ Bảy, Chủ nhật và ngày lễ. Đội ngũ tổng đài viên và bác sĩ tư vấn luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc.</p>
      <p className="mb-2">• Hotline hỗ trợ: <strong>028.7102.6595</strong></p>
      <p className="mb-2">• Inbox fanpage chính thức của GenderCare để được phản hồi nhanh</p>
      <p className="mb-2">• Hệ thống nhắc lịch và hỗ trợ theo dõi kết quả xét nghiệm được tích hợp qua App và Email cá nhân</p>
    </div>
  );
};

export default Pricing;