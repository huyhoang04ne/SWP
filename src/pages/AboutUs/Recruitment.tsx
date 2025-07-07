import React from "react";

const Recruitment = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-purple-700 mb-6">
        Tuyển dụng tại GenderCare
      </h1>
      <p className="text-gray-800 leading-relaxed mb-4 text-[15px]">
        Tại <strong>GenderCare</strong>, chúng tôi tin rằng đội ngũ nhân sự chính là yếu tố cốt lõi để mang đến dịch vụ chăm sóc sức khỏe chất lượng, chuyên nghiệp và nhân văn. Chúng tôi luôn tìm kiếm những ứng viên có tâm huyết, năng lực chuyên môn cao và mong muốn đóng góp cho cộng đồng trong lĩnh vực sức khỏe giới tính và phòng chống bệnh lây truyền qua đường tình dục (STI).
      </p>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-3">
          Các vị trí đang tuyển:
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 text-[15px]">
          <li>Bác sĩ chuyên khoa Da liễu – STI</li>
          <li>Tư vấn viên xét nghiệm HIV, giang mai, lậu</li>
          <li>Điều dưỡng – Hỗ trợ lấy mẫu xét nghiệm</li>
          <li>Nhân viên Marketing y tế</li>
          <li>Chuyên viên phát triển hệ thống phòng khám</li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-2">
          Quyền lợi khi làm việc tại GenderCare:
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 text-[15px]">
          <li>Môi trường làm việc chuyên nghiệp, thân thiện, chú trọng nhân văn và đạo đức nghề nghiệp.</li>
          <li>Cơ hội đào tạo, phát triển kỹ năng chuyên môn và kỹ năng mềm.</li>
          <li>Chế độ lương thưởng cạnh tranh, được đóng đầy đủ BHXH – BHYT.</li>
          <li>Các chế độ nghỉ phép, khám sức khỏe định kỳ và hỗ trợ chi phí xét nghiệm STI cho nhân viên.</li>
        </ul>
      </div>

      <div className="bg-purple-100 p-5 rounded-lg border border-purple-300">
        <h2 className="text-lg font-bold text-purple-900 mb-2">Cách thức ứng tuyển:</h2>
        <p className="text-gray-700 text-[15px]">
          Gửi CV và thư ứng tuyển về địa chỉ email:{" "}
          <a href="mailto:tuyendung@gendercare.vn" className="text-purple-700 font-semibold underline">
            tuyendung@gendercare.vn
          </a>
        </p>
        <p className="text-gray-700 mt-2 text-[15px]">
          Tiêu đề email: <strong>[Họ tên] – [Vị trí ứng tuyển] – GenderCare</strong>
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-6 italic">
        GenderCare luôn chào đón những người đồng hành trên hành trình xây dựng hệ thống y tế nhân ái, văn minh và bình đẳng.
      </p>
    </div>
  );
};

export default Recruitment;
