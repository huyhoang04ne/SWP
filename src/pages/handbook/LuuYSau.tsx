const LuuYSau = () => {
  return (
    
    <div className="max-w-4xl mx-auto px-6 py-10 text-[15px] leading-relaxed">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-6">
        Lưu ý sau khi xét nghiệm
      </h1>
      <div className="w-[120px] h-[3px] bg-purple-800 mb-6"></div>
        <img
        src="/Images/luuysauxetnghiem.jpg"
        alt="Hướng dẫn sau xét nghiệm"
        className="w-full max-w-2xl rounded-md shadow-md mx-auto mt-6"
      />
      <p className="mb-7 text-gray-800">
        Sau khi thực hiện các xét nghiệm bệnh lây truyền qua đường tình dục (STI) như HIV, lậu, giang mai..., bạn cần chú ý các điều sau để đảm bảo sức khỏe và theo dõi kết quả chính xác.
      </p>

      <h2 className="text-2xl font-bold text-purple-700 mb-4">1. Theo dõi ngay sau khi lấy mẫu</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1 text-gray-800">
        <li>Giữ băng gạc tại chỗ lấy máu ít nhất <strong>30 phút</strong> để cầm máu hoàn toàn.</li>
        <li>Nếu cảm thấy choáng hoặc mệt, hãy ngồi nghỉ tại chỗ lấy mẫu hoặc thông báo với nhân viên y tế.</li>
        <li>Uống nhiều nước, ăn nhẹ nếu cảm thấy đói sau khi lấy máu.</li>
        <li>Tránh vận động mạnh hoặc khiêng vác nặng trong 1–2 giờ đầu sau lấy mẫu.</li>
      </ul>

      <h2 className="text-2xl font-bold text-purple-700 mb-4">2. Theo dõi sức khỏe tại nhà</h2>
      <div className="overflow-x-auto shadow border rounded-lg mb-6">
        <table className="w-full table-auto text-left text-[15px]">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="px-4 py-3 border">Thời điểm</th>
              <th className="px-4 py-3 border">Cần theo dõi</th>
              <th className="px-4 py-3 border">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border">0 – 2 giờ đầu</td>
              <td className="px-4 py-3 border">Tình trạng choáng, chóng mặt, bầm tím tại chỗ lấy máu</td>
              <td className="px-4 py-3 border">Báo nhân viên y tế nếu có dấu hiệu bất thường</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border">2 – 24 giờ</td>
              <td className="px-4 py-3 border">Phản ứng phụ nhẹ (đau đầu, mỏi cơ, sốt nhẹ)</td>
              <td className="px-4 py-3 border">Nghỉ ngơi, uống nhiều nước, có thể dùng paracetamol nếu sốt  38.5°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border">24 – 72 giờ</td>
              <td className="px-4 py-3 border">Chờ kết quả xét nghiệm, hạn chế stress</td>
              <td className="px-4 py-3 border">Liên hệ phòng khám nếu chưa nhận kết quả hoặc có biểu hiện lạ</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-purple-700 mb-4">3. Chăm sóc sau xét nghiệm</h2>
      <ul className="list-disc pl-6 mb-6 text-gray-800 space-y-1">
        <li>Tiếp tục duy trì chế độ ăn uống lành mạnh, ngủ đủ giấc.</li>
        <li>Không sử dụng chất kích thích (rượu, bia, thuốc lá) ít nhất 24 giờ sau xét nghiệm.</li>
        <li>Tuân thủ lịch hẹn tái khám hoặc xét nghiệm lại theo chỉ định.</li>
        <li>Nếu kết quả dương tính với STI, hãy bình tĩnh – GenderCare có đội ngũ tư vấn đồng hành hỗ trợ điều trị và quản lý bệnh.</li>
      </ul>

      <h2 className="text-2xl font-bold text-purple-700 mb-4">4. Ghi chú quan trọng</h2>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-gray-800 mb-6">
        <ul className="list-disc pl-6 space-y-1">
          <li>Kết quả xét nghiệm có thể thay đổi tùy theo giai đoạn nhiễm bệnh hoặc thời điểm lấy mẫu.</li>
          <li>Một số xét nghiệm cần làm lại sau 1–3 tháng nếu nghi ngờ phơi nhiễm gần đây (ví dụ HIV).</li>
          <li>Mọi thông tin và kết quả đều được bảo mật tuyệt đối tại hệ thống GenderCare.</li>
        </ul>
      </div>

      <p className="mt-6 text-sm italic text-gray-600">
        Mọi thắc mắc sau xét nghiệm, vui lòng liên hệ Hotline <strong>039.204.2850</strong> để được hỗ trợ nhanh chóng từ đội ngũ y tế của GenderCare.
      </p>
    </div>
  );
};

export default LuuYSau;
