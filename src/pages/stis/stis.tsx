import React, { useState } from "react";

const accordionData = [
  {
    title: "1. Tổng quan về các bệnh lây truyền qua đường tình dục (STIs)",
    content:
      "STIs (Sexually Transmitted Infections) là nhóm bệnh truyền nhiễm chủ yếu qua quan hệ tình dục không an toàn, bao gồm đường âm đạo, hậu môn và miệng. Những bệnh này có thể do vi khuẩn, virus hoặc ký sinh trùng gây ra. Một số bệnh phổ biến bao gồm HIV/AIDS, lậu, giang mai, sùi mào gà, chlamydia và herpes sinh dục.\n\nCác bệnh STIs ảnh hưởng đến mọi đối tượng không phân biệt giới tính, độ tuổi hay xu hướng tình dục. Đáng chú ý là nhiều bệnh có thể không có triệu chứng rõ ràng, khiến người mắc không biết và tiếp tục lây lan cho người khác.\n\nViệc phát hiện sớm thông qua xét nghiệm định kỳ và điều trị kịp thời sẽ giúp ngăn ngừa các biến chứng nghiêm trọng như vô sinh, ung thư, tổn thương cơ quan sinh dục, đồng thời hạn chế sự lây lan trong cộng đồng.",
    image: "/images/STISS1.jpg",
    imageCaption:
      "Một số bệnh lây truyền qua đường tình dục phổ biến gồm HIV, lậu, giang mai, chlamydia và herpes.",
    extraImage: "/images/STISS2.jpg",
    extraCaption:
      "Xét nghiệm là bước quan trọng trong việc phát hiện và điều trị sớm các bệnh lây truyền qua đường tình dục."
  },
  {
    title: "2. Vai trò của xét nghiệm định kỳ trong phòng ngừa STIs",
    content:
      "Rất nhiều bệnh STI diễn tiến âm thầm và không có triệu chứng rõ ràng, đặc biệt là trong giai đoạn đầu. Do đó, việc xét nghiệm định kỳ là công cụ quan trọng để phát hiện sớm các bệnh lý tiềm ẩn.\n\nXét nghiệm định kỳ đặc biệt cần thiết với những người có hành vi tình dục không an toàn, có nhiều bạn tình, quan hệ đồng giới hoặc đang trong độ tuổi sinh sản. Nó giúp phát hiện sớm, điều trị kịp thời, ngăn ngừa lây nhiễm và biến chứng như viêm vùng chậu, vô sinh, ung thư cổ tử cung, thậm chí tử vong.\n\nNgoài ra, xét nghiệm còn là hành động trách nhiệm với bản thân và cộng đồng, thể hiện sự quan tâm đến sức khỏe sinh sản và góp phần vào công cuộc kiểm soát các bệnh lây qua đường tình dục.",
    image: "/images/STISS3.jpg",
    imageCaption:
      "Xét nghiệm định kỳ giúp phát hiện bệnh sớm ngay cả khi chưa có triệu chứng.",
    extraImage: "/images/STISS4.jpg",
    extraCaption:
      "Xét nghiệm định kỳ là biện pháp hiệu quả trong phòng ngừa và kiểm soát STIs."
  },
  {
    title: "3. HIV – Sự im lặng đáng sợ và nhu cầu xét nghiệm",
    content:
      "HIV là virus gây suy giảm hệ miễn dịch ở người. Nếu không điều trị, HIV sẽ phát triển thành AIDS – giai đoạn cuối của bệnh với nguy cơ tử vong cao.\n\nTuy nhiên, nhờ sự tiến bộ y học, người nhiễm HIV hiện nay có thể sống khỏe mạnh, làm việc, học tập và sinh hoạt bình thường nếu phát hiện sớm và tuân thủ điều trị bằng thuốc ARV. Việc xét nghiệm HIV không chỉ giúp kiểm soát bệnh hiệu quả mà còn giúp ngăn chặn sự lây truyền sang người khác.\n\nGenderCare cung cấp dịch vụ xét nghiệm HIV ẩn danh, bảo mật và nhanh chóng, giúp bạn chủ động kiểm tra, bảo vệ sức khỏe bản thân và đối tác một cách văn minh, hiện đại.",
    image: "/images/STISS6.jpg",
    imageCaption: "Chủ động xét nghiệm HIV – hành động nhỏ, ý nghĩa lớn.",
    extraImage: "/images/STISS77.jpg",
    extraCaption:
      "Xét nghiệm HIV nhanh chóng, bảo mật và ẩn danh tại GenderCare."
  },
  {
    title: "4. Lậu – Bệnh thường gặp nhưng dễ bị bỏ qua",
    content:
      "Lậu là một bệnh lây qua đường tình dục do vi khuẩn Neisseria gonorrhoeae gây ra. Bệnh ảnh hưởng chủ yếu đến niệu đạo, cổ tử cung, trực tràng và họng.\n\nNgười mắc có thể gặp các triệu chứng như tiểu buốt, tiết dịch bất thường, đau vùng chậu. Tuy nhiên, nhiều người – đặc biệt là nữ giới – có thể hoàn toàn không có biểu hiện lâm sàng. Điều này làm tăng nguy cơ biến chứng như vô sinh, viêm vùng chậu, nhiễm trùng máu nếu không được phát hiện và điều trị sớm.\n\nXét nghiệm lậu hiện nay được thực hiện bằng kỹ thuật PCR tiên tiến cho độ chính xác cao. GenderCare cung cấp dịch vụ xét nghiệm nhanh chóng, không xâm lấn và bảo mật, hỗ trợ người dùng phát hiện bệnh kịp thời.",
    image: "/images/STISS8.jpg",
    imageCaption:
      "Triệu chứng bệnh lậu thường bị nhầm lẫn và dễ bỏ qua.",
    extraImage: "/images/STISS9.jpg",
    extraCaption:
      "Lậu có thể không có triệu chứng rõ ràng – xét nghiệm định kỳ là cách duy nhất để phát hiện và điều trị kịp thời."
  },
  {
    title: "5. Giang mai – “Kẻ giết người thầm lặng” trong thế giới STIs",
    content:
      "Giang mai là bệnh do xoắn khuẩn Treponema pallidum gây ra, tiến triển âm thầm qua nhiều giai đoạn nếu không được điều trị. Ban đầu là vết loét không đau (săng giang mai), sau đó là phát ban, tổn thương thần kinh, tim mạch và cuối cùng có thể dẫn đến tử vong.\n\nĐiều đáng lo ngại là các giai đoạn đầu rất dễ bị bỏ qua, khiến bệnh tiến triển âm thầm và gây tổn thương không thể phục hồi.\n\nGenderCare cung cấp dịch vụ xét nghiệm giang mai bằng phương pháp hiện đại, cho kết quả nhanh trong ngày và đảm bảo tính riêng tư tuyệt đối cho người bệnh.",
    image: "/images/STISS10.jpg",
    imageCaption:
      "Giang mai có thể gây biến chứng nặng nếu không được điều trị kịp thời.",
    extraImage: "/images/STISS11.jpg",
    extraCaption:
      "Hình ảnh minh họa quá trình tiến triển của bệnh giang mai."
  },
  {
    title: "6. Khi nào bạn nên đi xét nghiệm STIs?",
    content:
      "Bạn nên xét nghiệm STIs khi có dấu hiệu bất thường như: đau khi tiểu, tiết dịch bất thường, loét hoặc ngứa vùng sinh dục, nổi hạch bẹn, hoặc phát ban không rõ nguyên nhân.\n\nNgoài ra, nếu bạn có quan hệ tình dục không sử dụng bao cao su, có nhiều bạn tình, quan hệ đồng giới hoặc đang chuẩn bị mang thai/kết hôn – bạn cũng nên xét nghiệm định kỳ.\n\nĐây là cách để chủ động bảo vệ sức khỏe sinh sản, tránh lây nhiễm cho đối tác, và duy trì cuộc sống tình dục an toàn, lành mạnh.",
    image: "/images/STISS12.jpg",
    imageCaption:
      "Nên xét nghiệm khi có các dấu hiệu bất thường hoặc nguy cơ cao.",
    extraImage: "/images/STISS13.jpg",
    extraCaption:
      "Các cặp đôi nên xét nghiệm định kỳ để duy trì quan hệ lành mạnh."
  },
  {
    title: "7. Dịch vụ xét nghiệm STIs tại GenderCare",
    content:
      "Tại GenderCare, chúng tôi cung cấp các gói xét nghiệm STIs toàn diện bao gồm: HIV, giang mai, lậu, chlamydia, HPV, viêm gan B/C.\n\nCác công nghệ xét nghiệm tiên tiến như PCR, ELISA, test nhanh kháng thể giúp phát hiện chính xác và sớm nhất các tác nhân gây bệnh. Người dùng có thể lựa chọn các gói xét nghiệm ẩn danh, tại nhà hoặc tại cơ sở với mức chi phí hợp lý.\n\nChúng tôi cam kết bảo mật thông tin, không kỳ thị, với đội ngũ chuyên gia tư vấn tận tâm và chuyên môn cao. GenderCare luôn đồng hành cùng bạn trên hành trình chăm sóc sức khỏe tình dục và sinh sản.",
    image: "/images/STISS14.jpg",
    imageCaption:
      "GenderCare cung cấp dịch vụ xét nghiệm STIs an toàn, hiện đại và bảo mật.",
    extraImage: "/images/STISS15.jpg",
    extraCaption:
      "Đội ngũ y tế GenderCare thân thiện, tư vấn chuyên sâu và hỗ trợ tận tâm."
  }
];

const Stis = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    testDate: "",
    testType: "",
    note: ""
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [viewMessage, setViewMessage] = useState<string | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { name, dob, gender, phone, email, testDate, testType } = formData;
    if (!name || !dob || !gender || !phone || !email || !testDate || !testType) {
      setMessage({ type: "error", text: "Phải điền đủ thông tin trên" });
      return;
    }
    setHasBooked(true);
    setMessage({
      type: "success",
      text: "Đã đặt lịch thành công. Bạn có 15 phút để thanh toán. Vui lòng thanh toán và xem trạng thái của bạn trong mục Xem lịch đã đặt"
    });
  };

  const today = new Date().toISOString().split("T")[0];

  const renderTestDetails = () => {
    switch (formData.testType) {
      case "HIV":
        return (
          <div className="mt-4 space-y-2 text-sm text-gray-800">
            <p>- Xét nghiệm HIV nhanh: <strong>120,000 VND</strong></p>
            <p>- Xét nghiệm HIV ELISA: <strong>300,000 VND</strong></p>
          </div>
        );
      case "Lậu":
        return (
          <div className="mt-4 space-y-2 text-sm text-gray-800">
            <p>- PCR Lậu: <strong>550,000 VND</strong></p>
            <p>- Soi dịch niệu đạo: <strong>300,000 VND</strong></p>
          </div>
        );
      case "Giang mai":
        return (
          <div className="mt-4 space-y-2 text-sm text-gray-800">
            <p>- RPR định tính: <strong>150,000 VND</strong></p>
            <p>- TPHA định tính: <strong>350,000 VND</strong></p>
          </div>
        );
      case "Combo":
        return (
          <div className="mt-4 space-y-2 text-sm text-gray-800">
            <p>- Combo HIV–Lậu–Giang mai: <strong>800,000 VND</strong></p>
            <p>- Tầm soát STI tổng quát: <strong>1,200,000 VND</strong></p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        HỆ THỐNG ĐẶT LỊCH XÉT NGHIỆM STIs
      </h1>
      <div className="w-[480px] h-[3px] bg-purple-800 mb-6"></div>

      <div className="space-y-10">
        {accordionData.map((item, index) => (
          <div key={index} className="space-y-4">
            <div className="border border-purple-300 rounded-lg">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center px-4 py-3 bg-purple-100 hover:bg-purple-200 text-left font-semibold text-purple-800 transition"
              >
                {item.title}
                <span>{openIndex === index ? "▲" : "▼"}</span>
              </button>
              {openIndex === index && (
                <div className="px-4 py-4 text-gray-800 text-[16px] md:text-[18px] leading-relaxed animate-fade-in space-y-4">
                  <p className="whitespace-pre-line">{item.content}</p>
                  <div className="flex justify-center">
                    <img src={item.image} alt="ảnh nội dung" className="rounded-md shadow-md w-full max-w-[500px]" />
                  </div>
                  <p className="text-center italic text-gray-500">{item.imageCaption}</p>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-2">
              <img src={item.extraImage} alt="ảnh ngoài" className="rounded-lg shadow-lg w-full max-w-[700px]" />
            </div>
            <p className="text-center italic text-gray-600">{item.extraCaption}</p>
          </div>
        ))}

        <div className="flex justify-end gap-4 mt-10">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            ĐẶT LỊCH MỚI
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded"
            onClick={() => {
              if (!hasBooked) {
                setViewMessage("Bạn chưa có lịch. Bạn cần đặt lịch mới.");
              } else {
                setViewMessage("Bạn đã đặt lịch. Vui lòng kiểm tra tại mục lịch sử hoặc quản lý.");
              }
            }}
          >
            XEM LỊCH ĐÃ ĐẶT
          </button>
        </div>
        {viewMessage && <p className="text-red-600 font-medium mt-2">{viewMessage}</p>}

        {showForm && (
          <div className="mt-8 border p-6 rounded-lg shadow-md bg-gray-50">
            <h2 className="text-xl font-bold text-purple-700 mb-4">ĐẶT LỊCH XÉT NGHIỆM STIs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" type="text" placeholder="Họ và tên" value={formData.name} onChange={handleFormChange} className="border rounded p-2" />
              <input name="dob" type="date" value={formData.dob} onChange={handleFormChange} className="border rounded p-2" />
              <select name="gender" value={formData.gender} onChange={handleFormChange} className="border rounded p-2">
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <input name="phone" type="number" placeholder="Số điện thoại" value={formData.phone} onChange={handleFormChange} className="border rounded p-2" />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleFormChange} className="border rounded p-2" />
              <input name="testDate" type="date" min={today} value={formData.testDate} onChange={handleFormChange} className="border rounded p-2" />
              <select name="testType" value={formData.testType} onChange={handleFormChange} className="border rounded p-2">
                <option value="">Chọn loại xét nghiệm</option>
                <option value="HIV">HIV</option>
                <option value="Lậu">Lậu</option>
                <option value="Giang mai">Giang mai</option>
                <option value="Combo">Combo</option>
              </select>
              <textarea name="note" placeholder="Ghi chú" value={formData.note} onChange={handleFormChange} className="border rounded p-2 col-span-1 md:col-span-2" />
            </div>

            {formData.testType && (
              <div className="mt-6">
                {renderTestDetails()}
                <p className="mt-4 text-sm italic text-gray-600">Mọi thông tin về giá vui lòng xem thêm trong trang <strong>Bảng Giá</strong>.</p>
                <div className="mt-4 flex justify-center">
                  <img src="/images/QRCODE.jpg" alt="QR Thanh toán" className="w-[200px] h-[200px] object-contain" />
                </div>
              </div>
            )}

            <div className="mt-6">
              <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded">
                ĐẶT NGAY
              </button>
            </div>
            {message && (
              <p className={`mt-4 font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stis;
