import React, { useState } from "react";

const topics = [
  {
    title: "Tổng Quát",
    icon: "/Images/TONGQUAT.jpg",
    content: `Tổng quan về các bệnh lý phổ biến trong cộng đồng giúp người dân có kiến thức nền tảng để tự chăm sóc và phòng ngừa bệnh hiệu quả:

- Các bệnh lý nội khoa thường gặp như tăng huyết áp, tiểu đường, bệnh tim mạch.
- Các bệnh truyền nhiễm theo mùa như cúm, sốt xuất huyết.
- Cách phát hiện sớm triệu chứng nguy hiểm: ho kéo dài, sốt dai dẳng, đau ngực, sụt cân không rõ nguyên nhân.
- Nguyên tắc phòng ngừa và bảo vệ sức khỏe: tiêm chủng, ăn uống lành mạnh, vận động, khám sức khỏe định kỳ.
- Vai trò của hệ thống y tế và khi nào cần đến bác sĩ.`
  },
  {
    title: "HIV/AIDS",
    icon: "/Images/HIV.jpg",
    content: `HIV là virus tấn công hệ miễn dịch, gây suy giảm khả năng chống lại bệnh tật. Kiến thức đầy đủ giúp phòng ngừa và sống khỏe:

- HIV lây qua máu, dịch sinh dục và từ mẹ sang con.
- Phân biệt HIV và AIDS: HIV là virus, AIDS là giai đoạn cuối của nhiễm HIV.
- Triệu chứng: sốt kéo dài, nổi hạch, sút cân nhanh, tiêu chảy mạn tính.
- Xét nghiệm sàng lọc sớm, an toàn, bảo mật.
- Dự phòng: PrEP (dự phòng trước phơi nhiễm), PEP (sau phơi nhiễm), sử dụng bao cao su đúng cách.
- Điều trị: ARV giúp giảm tải lượng virus và kéo dài tuổi thọ.`
  },
  {
    title: "Lậu",
    icon: "/Images/LAU.jpg",
    content: `Lậu là bệnh lây truyền qua đường tình dục phổ biến, có thể gây vô sinh nếu không điều trị kịp thời:

- Do vi khuẩn Neisseria gonorrhoeae gây ra.
- Triệu chứng nam giới: tiểu buốt, tiểu ra mủ, đau tinh hoàn.
- Triệu chứng nữ giới: khí hư bất thường, đau vùng chậu, tiểu rắt.
- Lây lan qua quan hệ không an toàn, kể cả bằng miệng.
- Điều trị: kháng sinh theo phác đồ bác sĩ.
- Biến chứng nếu không chữa trị: viêm tiểu khung, vô sinh, lây cho bạn tình.`
  },
  {
    title: "Giang Mai",
    icon: "/Images/GiangMai.jpg",
    content: `Giang mai là bệnh xã hội nguy hiểm, phát triển âm thầm qua nhiều giai đoạn:

- Giai đoạn 1: vết loét không đau ở cơ quan sinh dục, hậu môn, miệng.
- Giai đoạn 2: phát ban toàn thân, sốt nhẹ, sưng hạch.
- Giai đoạn 3: tiềm ẩn không triệu chứng trong nhiều năm.
- Giai đoạn 4: tổn thương não, tim, xương khớp, có thể tử vong.
- Xét nghiệm máu để phát hiện sớm.
- Điều trị: kháng sinh đặc hiệu (penicillin) theo hướng dẫn y tế.
- Cần điều trị cả bạn tình để tránh tái nhiễm.`
  },
  {
    title: "Chu kỳ kinh nguyệt & các vấn đề liên quan",
    icon: "/Images/CHUKIKINHNGUYET.jpg",
    content: `Chu kỳ kinh nguyệt là một chỉ dấu quan trọng về sức khỏe sinh sản nữ giới:

- Chu kỳ bình thường kéo dài 21–35 ngày, hành kinh 3–7 ngày.
- Dấu hiệu sắp rụng trứng: chất nhầy cổ tử cung trong, dai, nhiệt độ tăng nhẹ.
- Rối loạn kinh nguyệt: rong kinh, vô kinh, kinh sớm, kinh muộn, đau bụng dữ dội.
- Nguyên nhân: stress, mất cân bằng nội tiết, bệnh lý tử cung.
- Biện pháp theo dõi và điều chỉnh: ghi chú chu kỳ, ăn uống khoa học, khám phụ khoa định kỳ.
- Hệ thống GHMS hỗ trợ người dùng ghi nhận và cảnh báo sớm các dấu hiệu bất thường.`
  },
];

const Pathology = () => {
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-6 uppercase">
        Thông tin bệnh học
      </h1>
      <div className="w-[200px] h-[3px] bg-purple-800 mx-auto mb-8"></div>

      {/* Grid icon bệnh học */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition"
            onClick={() => setSelectedTopic(topic)}
          >
            {/* Hình ảnh */}
            <div className="w-24 h-24 mb-4">
              <img
                src={topic.icon}
                alt={topic.title}
                className="w-full h-full object-cover rounded-md border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/Images/default-icon.png";
                }}
              />
            </div>
            {/* Tiêu đề */}
            <p className="text-base sm:text-lg font-semibold text-purple-800">
              {topic.title}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-lg w-full rounded-xl shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setSelectedTopic(null)}
            >
              ✖
            </button>
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src={selectedTopic.icon}
                alt={selectedTopic.title}
                className="w-full h-full object-cover rounded-md border"
              />
            </div>
            <h3 className="text-2xl font-bold text-center text-purple-800 mb-3">
              {selectedTopic.title}
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line text-justify">
              {selectedTopic.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pathology;
