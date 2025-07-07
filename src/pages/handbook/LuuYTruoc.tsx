const LuuYTruoc = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-6">
        Lưu ý trước khi xét nghiệm
      </h1>
      <div className="w-[120px] h-[3px] bg-purple-800 mb-6"></div>

      <p className="mb-4 text-[15px] text-gray-800 leading-relaxed">
        Để đảm bảo kết quả xét nghiệm bệnh lây truyền qua đường tình dục (STI) như HIV, giang mai, lậu đạt độ chính xác cao nhất,
        bạn cần chuẩn bị kỹ lưỡng trước khi thực hiện. Những lưu ý dưới đây sẽ giúp bạn chủ động hơn và tránh sai lệch kết quả.
      </p>

      <h2 className="text-xl font-bold text-purple-700 mb-2">1. Nhịn ăn có cần thiết không?</h2>
      <p className="mb-4 text-[15px] text-gray-800">
        Hầu hết các xét nghiệm STI như HIV, giang mai, lậu không yêu cầu nhịn ăn. Tuy nhiên, nếu bạn làm kèm các xét nghiệm sinh hóa máu 
        (đường huyết, mỡ máu, chức năng gan thận), bạn nên nhịn ăn ít nhất 8 tiếng trước khi lấy máu để đảm bảo độ chính xác.
      </p>

      <h2 className="text-xl font-bold text-purple-700 mb-2">2. Tránh quan hệ tình dục trước xét nghiệm</h2>
      <p className="mb-4 text-[15px] text-gray-800">
        Đối với xét nghiệm lậu, chlamydia và các bệnh lý liên quan đến dịch sinh dục, cần kiêng quan hệ tình dục ít nhất 48 giờ trước khi lấy mẫu.
        Việc này giúp hạn chế nguy cơ ảnh hưởng đến mẫu bệnh phẩm và giúp xét nghiệm phản ánh đúng tình trạng nhiễm bệnh hiện tại.
      </p>

      <h2 className="text-xl font-bold text-purple-700 mb-2">3. Không tự ý dùng thuốc</h2>
      <p className="mb-4 text-[15px] text-gray-800">
        Việc sử dụng kháng sinh hoặc thuốc kháng virus trước xét nghiệm có thể làm sai lệch kết quả. Bạn nên tránh dùng thuốc
        điều trị STI ít nhất 5–7 ngày trước khi lấy mẫu. Nếu bạn đang điều trị bệnh khác, hãy thông báo rõ cho bác sĩ.
      </p>

      <h2 className="text-xl font-bold text-purple-700 mb-2">4. Không rửa sâu âm đạo hoặc sử dụng dung dịch sát khuẩn mạnh</h2>
      <p className="mb-4 text-[15px] text-gray-800">
        Với nữ giới, cần tránh thụt rửa sâu âm đạo hoặc sử dụng dung dịch vệ sinh sát khuẩn mạnh ít nhất 24 giờ trước khi xét nghiệm.
        Việc rửa quá sâu có thể làm mất đi mẫu bệnh phẩm hoặc ảnh hưởng đến vi khuẩn đang cần được phát hiện.
      </p>

      <h2 className="text-xl font-bold text-purple-700 mb-2">5. Không xét nghiệm khi đang có kinh nguyệt</h2>
      <p className="mb-4 text-[15px] text-gray-800">
        Nếu bạn là nữ và được chỉ định xét nghiệm liên quan đến dịch âm đạo hoặc cổ tử cung, hãy tránh thực hiện trong thời kỳ hành kinh.
        Kết quả có thể bị ảnh hưởng bởi máu kinh, gây khó khăn trong quá trình lấy mẫu và giảm độ chính xác.
      </p>

      <h2 className="text-xl font-bold text-purple-700 mb-2">6. Thông báo cho nhân viên y tế các yếu tố liên quan</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-800 text-[15px] space-y-1">
        <li>Bạn đã từng có kết quả dương tính hoặc điều trị STI trước đó?</li>
        <li>Bạn đang sử dụng thuốc gì? Có dị ứng thuốc nào không?</li>
        <li>Bạn có đang mang thai hoặc nghi ngờ mang thai?</li>
        <li>Bạn có các biểu hiện như sốt, nổi hạch, ngứa, loét bộ phận sinh dục?</li>
      </ul>

      <h2 className="text-xl font-bold text-purple-700 mb-2">7. Chuẩn bị giấy tờ & tinh thần</h2>
      <p className="mb-6 text-[15px] text-gray-800">
        Mang theo giấy tờ tùy thân, mã đặt lịch (nếu có). Đồng thời, giữ tâm lý thoải mái, tự tin. Xét nghiệm STI là hoàn toàn bình thường, an toàn và mang tính riêng tư tuyệt đối tại GenderCare.
      </p>

      <img
       src="/Images/luuyxetnghiem.jpg"
       alt="Lưu ý trước khi xét nghiệm"
       className="w-full max-w-3xl rounded-md shadow-md mx-auto mb-6"
      />

      {/* 🔷 Box khung xanh thông tin bác sĩ */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6 text-[15px] text-gray-800">
        <h3 className="font-semibold text-[16px] mb-2">Bác sĩ sẽ khám như thế nào</h3>
        <p className="mb-2">
          Trước khi tiến hành xét nghiệm, bác sĩ tại GenderCare sẽ thực hiện kiểm tra sức khỏe tổng quát để đảm bảo bạn đủ điều kiện thực hiện.
          Quy trình thăm khám bao gồm:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Đo thân nhiệt, nhịp tim, huyết áp</li>
          <li>Khám tổng quát vùng sinh dục (nếu cần thiết)</li>
          <li>Đánh giá triệu chứng lâm sàng hoặc tiền sử bệnh</li>
          <li>Thảo luận các loại thuốc đang sử dụng</li>
          <li>Hướng dẫn quy trình lấy mẫu an toàn – chính xác</li>
        </ul>
      </div>

      {/* 🔷 Hướng dẫn trước khi xét nghiệm cho người lớn & trẻ */}
      <h2 className="text-2xl font-bold text-purple-800 mt-10 mb-4">
        Hướng dẫn trước khi xét nghiệm
      </h2>

      <h3 className="font-semibold text-purple-700 mb-2">Đối với trẻ vị thành niên:</h3>
      <ul className="list-disc pl-6 text-[15px] text-gray-800 mb-4 space-y-1">
        <li>Người giám hộ cần đi cùng trẻ và cung cấp đầy đủ thông tin về sức khỏe, hành vi nguy cơ, thuốc đang dùng.</li>
        <li>Nếu trẻ chưa đủ tuổi hoặc không đồng thuận xét nghiệm, GenderCare sẽ có bác sĩ tư vấn riêng trước khi lấy mẫu.</li>
        <li>Nên chuẩn bị tâm lý và trao đổi trước với trẻ về lý do, tầm quan trọng của việc xét nghiệm.</li>
        <li>Không nên ép buộc nếu trẻ có dấu hiệu sợ hãi hay phản ứng tâm lý mạnh.</li>
      </ul>

      <h3 className="font-semibold text-purple-700 mb-2">Đối với người lớn:</h3>
      <ul className="list-disc pl-6 text-[15px] text-gray-800 mb-2 space-y-1">
        <li>Tránh xét nghiệm khi đang sốt cao, mệt mỏi hoặc bị bệnh cấp tính.</li>
        <li>Thông báo rõ ràng các mối quan hệ tình dục không an toàn gần đây nếu có.</li>
        <li>Không e ngại – mọi thông tin đều được giữ bảo mật tuyệt đối.</li>
        <li>Trong trường hợp cần, bác sĩ sẽ tư vấn thêm các gói xét nghiệm phù hợp khác như HPV, viêm gan B, viêm gan C...</li>
      </ul>

      <p className="mt-6 text-sm italic text-gray-600">
        Nếu bạn cần tư vấn riêng hoặc có các triệu chứng bất thường, vui lòng liên hệ hotline <strong>039.204.2850</strong> để được bác sĩ hướng dẫn.
      </p>
    </div>
  );
};

export default LuuYTruoc;
