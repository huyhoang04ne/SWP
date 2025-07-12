import React, { useState } from "react";

const experts = [
  {
    name: "ThS. Nguyễn Minh Thắng",
    title: "Tư vấn viên sức khỏe giới tính & tâm lý",
    description: "Tư vấn về giới tính, bản dạng giới và định hướng tình dục",
    image: "/Images/tuvanvien4.jpg",
    profile: {
      introduction: "Chuyên gia tư vấn tâm lý giới tính và LGBTQ+ với hơn 10 năm kinh nghiệm hỗ trợ cá nhân trong việc khám phá bản dạng giới, vượt qua khủng hoảng tâm lý và xây dựng mối quan hệ tích cực.",
      experience: "- Tư vấn viên cấp cao tại GenderCare từ năm 2015\n- Giảng viên cộng đồng tại các buổi hội thảo về giới tính\n- Tư vấn tâm lý cá nhân và nhóm",
      degrees: "- Thạc sĩ Tâm lý học\n- Chứng chỉ chuyên sâu về tâm lý học LGBTQ+\n- Chứng chỉ tư vấn hành vi nhận thức (CBT)",
      research: "- Nghiên cứu: Tác động của xã hội đối với bản dạng giới\n- Dự án: Hỗ trợ cộng đồng trẻ LGBTQ+ tại Việt Nam"
    }
  },
  {
    name: "ThS. Nguyễn Tấn Phúc",
    title: "Tư vấn viên xét nghiệm STI",
    description: "Hướng dẫn người dùng chọn gói xét nghiệm phù hợp và xử lý hậu xét nghiệm",
    image: "/Images/tuvanvien2.jpg",
    profile: {
      introduction: "Chuyên gia tư vấn xét nghiệm và theo dõi STIs với kiến thức sâu rộng về các bệnh truyền nhiễm và quy trình chẩn đoán.",
      experience: "- Tư vấn viên chính tại phòng khám GenderCare\n- 8 năm kinh nghiệm tư vấn về STIs\n- Từng làm việc tại Trung tâm Xét nghiệm Quốc gia",
      degrees: "- Thạc sĩ Y tế công cộng\n- Chứng chỉ đào tạo chuyên sâu về các bệnh lây truyền qua đường tình dục",
      research: "- Tham gia nghiên cứu về hiệu quả điều trị PrEP\n- Đồng tác giả sổ tay tư vấn STIs cho cộng đồng"
    }
  },
  {
    name: "ThS. Nguyễn Trung Trực",
    title: "Tư Vấn Viên nam khoa",
    description: "Tư vấn sức khỏe giới tính nam",
    image: "/Images/tuvanvien1.jpg",
    profile: {
      introduction: "Chuyên viên tư vấn về sức khỏe sinh lý và tâm lý cho nam giới, đặc biệt là thanh thiếu niên và người chuyển giới nam.",
      experience: "- 6 năm tư vấn sức khỏe sinh sản cho nam giới\n- Cố vấn cộng đồng tại các tổ chức sức khỏe nam giới\n- Điều phối chương trình nam giới khỏe mạnh tại GenderCare",
      degrees: "- Thạc sĩ Tâm lý học sức khỏe\n- Chứng chỉ sức khỏe sinh lý nam\n- Khóa đào tạo về giới tính học",
      research: "- Tác giả nghiên cứu: Sức khỏe giới tính nam đô thị\n- Thuyết trình tại Hội thảo Quốc tế về Nam học tại Singapore"
    }
  },
  {
    name: "ThS Nguyễn Thị Nhã",
    title: "Tư vấn viên phụ khoa",
    description: "Tư vấn sức khỏe giới tính nữ",
    image: "/Images/Bacsin.jpg",
    profile: {
      introduction: "Chuyên gia về chăm sóc sức khỏe giới tính nữ, từ giáo dục giới tính đến phòng ngừa bệnh lý phụ khoa cho phụ nữ trẻ.",
      experience: "- Tư vấn viên sức khỏe sinh sản nữ tại GenderCare\n- Tổ chức hơn 50 buổi hội thảo sức khỏe cho học sinh, sinh viên\n- Cộng tác viên tại các chương trình giáo dục tình dục an toàn",
      degrees: "- Thạc sĩ Y học phụ khoa\n- Chứng nhận tư vấn chăm sóc sức khỏe vị thành niên",
      research: "- Báo cáo viên trong đề tài: Ứng dụng AI trong sàng lọc bệnh phụ khoa\n- Đồng tác giả chương trình đào tạo tư vấn phụ khoa cộng đồng"
    }
  },
  {
    name: "ThS Huỳnh Thị Diễm My",
    title: "Tư vấn viên đăng ký & dịch vụ",
    description: "Hướng dẫn thủ tục đăng ký, chọn gói dịch vụ và theo dõi lịch hẹn",
    image: "/Images/tuvanvien6.jpg",
    profile: {
      introduction: "Chuyên viên hỗ trợ khách hàng với kỹ năng giao tiếp và xử lý tình huống tuyệt vời, giúp khách hàng tiếp cận dịch vụ y tế một cách hiệu quả.",
      experience: "- Hơn 7 năm trong ngành chăm sóc khách hàng y tế\n- Trưởng nhóm tiếp nhận tại GenderCare\n- Hỗ trợ hơn 2000 lượt đăng ký tư vấn mỗi năm",
      degrees: "- Thạc sĩ Quản trị Dịch vụ Y tế\n- Chứng chỉ Giao tiếp Chăm sóc Khách hàng chuyên sâu",
      research: "- Tổ chức khảo sát mức độ hài lòng khách hàng tại GenderCare\n- Báo cáo phân tích hiệu quả quy trình đăng ký khám chữa bệnh"
    }
  },
  {
    name: "ThS.BS Dương Tuấn Kiệt",
    title: "Bác sĩ Sản Phụ khoa",
    description: "Tư vấn & điều trị các vấn đề sức khỏe sinh sản cho phụ nữ",
    image: "/Images/Bacsikit.jpg",
    profile: {
      introduction: "Bác sĩ sản phụ khoa nhiều năm kinh nghiệm, tập trung vào chăm sóc sức khỏe sinh sản, phòng ngừa và điều trị các bệnh lý phụ khoa.",
      experience: "- Bác sĩ trưởng khoa Sản tại bệnh viện Đa khoa GenderCare\n- 12 năm khám chữa bệnh sản khoa\n- Giảng viên Sản khoa tại Đại học Y Dược TP.HCM",
      degrees: "- Bác sĩ chuyên khoa I Sản\n- Thạc sĩ Y học sản\n- Chứng chỉ nội soi phụ khoa",
      research: "- Chủ nhiệm đề tài nghiên cứu: Ảnh hưởng nội tiết tố đến khả năng sinh sản\n- Tác giả bài báo quốc tế về điều trị nội khoa trong sản phụ khoa"
    }
  },
  {
    name: "ThS.BS Lê Minh Phúc",
    title: "Chuyên gia về STIs",
    description: "Tư vấn & điều trị dự phòng STIs",
    image: "/Images/bacsi3.jpg",
    profile: {
      introduction: "Bác sĩ chuyên sâu về các bệnh lây truyền qua đường tình dục với kiến thức thực tế và cập nhật về điều trị, tư vấn và dự phòng.",
      experience: "- Bác sĩ điều trị STIs tại GenderCare\n- Cố vấn kỹ thuật cho dự án quốc tế về phòng tránh HIV\n- Tham gia chiến dịch truyền thông quốc gia phòng chống STIs",
      degrees: "- Bác sĩ chuyên khoa Da liễu\n- Thạc sĩ Y học dự phòng",
      research: "- Tác giả sách hướng dẫn tư vấn STIs cho bác sĩ cộng đồng\n- Tham gia nhóm nghiên cứu liên ngành về tình dục an toàn"
    }
  },
  {
    name: "ThS.BS Trần Thị Mỹ Diệu",
    title: "Chuyên gia Xét nghiệm",
    description: "Giải thích kết quả & hỗ trợ xét nghiệm",
    image: "/Images/bacsi1.jpg",
    profile: {
      introduction: "Chuyên gia phân tích và tư vấn kết quả xét nghiệm với độ chính xác cao, giúp bệnh nhân hiểu rõ và chủ động trong điều trị.",
      experience: "- Trưởng phòng xét nghiệm tại GenderCare\n- Hơn 10 năm kinh nghiệm trong lĩnh vực xét nghiệm y học\n- Giảng viên chuyên đề Xét nghiệm lâm sàng",
      degrees: "- Thạc sĩ Kỹ thuật Xét nghiệm Y học\n- Chứng chỉ quản lý phòng Lab ISO 15189",
      research: "- Tác giả tài liệu đào tạo nội bộ xét nghiệm\n- Đồng tác giả nghiên cứu: Ứng dụng sinh học phân tử trong tầm soát bệnh"
    }
  },
  {
    name: "ThS.BS Nguyễn Thị Minh Tâm",
    title: "Điều dưỡng trưởng",
    description: "Hỗ trợ chăm sóc bệnh nhân & tư vấn dịch vụ",
    image: "/Images/bacsi4.jpg",
    profile: {
      introduction: "Điều dưỡng trưởng tận tâm, giàu kinh nghiệm trong chăm sóc bệnh nhân và hướng dẫn quy trình dịch vụ y tế.",
      experience: "- 15 năm kinh nghiệm điều dưỡng tại bệnh viện công và tư\n- Trưởng nhóm đào tạo điều dưỡng mới tại GenderCare\n- Tham gia chương trình hỗ trợ chăm sóc bệnh nhân toàn diện",
      degrees: "- Cử nhân Điều dưỡng\n- Chứng chỉ Quản lý điều dưỡng\n- Khóa học giao tiếp điều dưỡng nâng cao",
      research: "- Đề tài: Nâng cao chất lượng chăm sóc hậu phẫu\n- Báo cáo thực tiễn chăm sóc bệnh nhân trong giai đoạn phục hồi"
    }
  }
];

const OurMedicalTeam = () => {
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">CHUYÊN GIA</h1>
      <div className="w-[200px] h-[3px] bg-purple-800 mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {experts.map((expert, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center text-center p-4"
          >
            <img
              src={expert.image}
              alt={expert.name}
              className="w-full aspect-[3/4] object-cover rounded-lg mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/Images/default-avatar.jpg";
              }}
            />
            <h3 className="font-semibold text-lg text-purple-900">{expert.name}</h3>
            <p className="text-sm text-gray-600">{expert.title}</p>
            <p className="text-sm text-gray-500">{expert.description}</p>
            <button
              onClick={() => {
                setSelectedExpert(expert);
                setShowModal(true);
              }}
              className="mt-4 px-4 py-1 border border-purple-600 text-purple-600 rounded hover:bg-purple-100 text-sm font-medium"
            >
              TÌM HIỂU THÊM
            </button>
          </div>
        ))}
      </div>

      {/* Modal chi tiết chuyên gia */}
      {showModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            
            <img
              src={selectedExpert.image}
              alt={selectedExpert.name}
              className="w-full aspect-[3/4] object-cover rounded-lg mb-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/Images/default-avatar.jpg";
              }}
            />
            <h3 className="text-xl font-bold text-purple-800 mb-2">{selectedExpert.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedExpert.title}</p>

            {selectedExpert.profile && (
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-purple-700 mb-1">GIỚI THIỆU</h4>
                  <p>{selectedExpert.profile.introduction}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 mb-1">KINH NGHIỆM CÔNG TÁC</h4>
                  <pre className="whitespace-pre-wrap font-sans">{selectedExpert.profile.experience}</pre>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 mb-1">BẰNG CẤP</h4>
                  <pre className="whitespace-pre-wrap font-sans">{selectedExpert.profile.degrees}</pre>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-700 mb-1">NGHIÊN CỨU KHOA HỌC</h4>
                  <pre className="whitespace-pre-wrap font-sans">{selectedExpert.profile.research}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OurMedicalTeam;