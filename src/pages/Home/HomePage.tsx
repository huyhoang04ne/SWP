import React, { useRef, useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/Footer';
import banner1 from '../../assets/gender_care_clinic_hero.jpg';
import Header from '../../components/header';

const HomePage: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const serviceRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const handleScrollToService = () => {
    serviceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const serviceDetails: { [key: string]: string } = {
    'Theo dõi chu kỳ kinh nguyệt': `Tại GenderCare, chúng tôi cung cấp một nền tảng theo dõi chu kỳ kinh nguyệt tiên tiến, không chỉ đơn thuần là ghi chú ngày bắt đầu hay kết thúc kỳ kinh, mà còn là công cụ chăm sóc sức khỏe sinh sản toàn diện cho người dùng ở mọi độ tuổi.

Người dùng có thể:

Dễ dàng nhập ngày bắt đầu và kết thúc kỳ hành kinh.

Ghi chú các triệu chứng tiền kinh nguyệt: đau bụng, đau lưng, mệt mỏi, nổi mụn, thay đổi cảm xúc...

Gắn màu sắc, biểu tượng và ghi chú riêng cho từng ngày.

Hệ thống sẽ tự động:

Tính toán chu kỳ trung bình qua các tháng.

Dự đoán thời gian rụng trứng, thời điểm dễ thụ thai và các kỳ tiếp theo.

Gửi thông báo định kỳ về thời điểm dùng thuốc tránh thai, đến ngày hành kinh, kỳ khám phụ khoa hoặc chích ngừa HPV.

Tính năng nâng cao:

Đồng bộ với Google Calendar.

Tích hợp AI để phân tích bất thường trong chu kỳ: chu kỳ kéo dài >35 ngày, ra máu bất thường, trễ kinh nhiều lần, v.v.

Đưa ra khuyến nghị đi khám khi có dấu hiệu nghi ngờ hội chứng buồng trứng đa nang (PCOS), u xơ tử cung hoặc rối loạn nội tiết tố.

Biểu đồ trực quan thể hiện lịch sử chu kỳ theo tuần, tháng, quý.

Chế độ "kế hoạch hóa gia đình": dành cho các cặp đôi muốn sinh con hoặc ngừa thai tự nhiên.

👉 Phù hợp với: Phụ nữ đang hành kinh, người lập kế hoạch mang thai, bệnh nhân dùng nội tiết tố, học sinh/sinh viên cần theo dõi sức khỏe sinh sản.

🔒 Cam kết bảo mật: Mọi dữ liệu được mã hóa đầu cuối, không chia sẻ với bên thứ ba. Người dùng có thể xuất dữ liệu nếu cần gửi cho bác sĩ điều trị.`,
    'Tư vấn sức khỏe giới tính': `GenderCare mang đến dịch vụ tư vấn giới tính và tâm lý toàn diện với sự đồng hành của đội ngũ:

Bác sĩ sản phụ khoa – nam khoa.

Chuyên gia tâm lý lâm sàng.

Cố vấn cộng đồng LGBTQ+.

Hình thức tư vấn:

Tư vấn 1-1 qua video call, điện thoại hoặc trực tiếp tại cơ sở.

Có thể lựa chọn tư vấn viên theo giới tính, độ tuổi hoặc chuyên môn.

Nội dung tư vấn:

Hiểu đúng về dậy thì, giới tính sinh học – bản dạng giới – xu hướng tính dục.

Hướng dẫn quan hệ tình dục an toàn, giao tiếp trong mối quan hệ tình cảm.

Tư vấn về hậu quả của lạm dụng tình dục, bảo vệ quyền cá nhân, phòng tránh mang thai ngoài ý muốn.

Giải tỏa khủng hoảng tâm lý liên quan đến bản dạng giới, đồng tính luyến ái, chuyển giới...

Hỗ trợ cho cặp đôi trong giao tiếp, xây dựng mối quan hệ lành mạnh, và vượt qua hậu chia tay.

Hỗ trợ trẻ vị thành niên hiểu đúng về cơ thể, tôn trọng bản thân và người khác.

Quy trình:

Mỗi buổi tư vấn kéo dài 45–60 phút.

Được cấp sổ theo dõi cảm xúc cá nhân (digital hoặc giấy).

Có thể tư vấn định kỳ theo tuần hoặc tháng.

Lưu trữ hồ sơ cá nhân bảo mật để hỗ trợ điều trị nội tiết hoặc tâm lý khi cần.

👉 Phù hợp với: Học sinh, sinh viên, người đang trải qua khủng hoảng danh tính giới, cặp đôi gặp khó khăn trong giao tiếp, người trưởng thành muốn nâng cao hiểu biết giới tính.

🌍 Hỗ trợ đa ngôn ngữ: Tiếng Việt – Anh – có thể yêu cầu phiên dịch viên hoặc hình thức văn bản nếu cần.

`,
    'Đặt lịch xét nghiệm STIs': `Chăm sóc sức khỏe tình dục bắt đầu từ việc xét nghiệm định kỳ các bệnh STIs (Sexually Transmitted Infections). GenderCare xây dựng hệ thống đặt lịch xét nghiệm nhanh chóng, kín đáo và chính xác, giúp người dùng chủ động theo dõi sức khỏe.

Bệnh được xét nghiệm tại hệ thống:

HIV (test nhanh, ELISA, PCR).

Giang mai (Syphilis), Lậu (Gonorrhea), Chlamydia.

Viêm gan B, viêm gan C.

HPV (Human Papilloma Virus).

Herpes sinh dục, Mycoplasma/Ureaplasma.

Quy trình đặt lịch:

Chọn gói xét nghiệm cá nhân hoặc cặp đôi (có sẵn combo).

Lựa chọn cơ sở gần bạn (hiển thị Google Map).

Chọn khung giờ phù hợp (sáng – chiều – tối, kể cả cuối tuần).

Nhận mã QR để đến cơ sở làm thủ tục nhanh.

Đặc điểm nổi bật:

Kết quả bảo mật: chỉ có người đặt lịch mới xem được, có thể yêu cầu in kết quả để trình bày bác sĩ.

Thời gian trả kết quả: 30 phút – 48h tùy loại xét nghiệm.

Chăm sóc hậu xét nghiệm: tư vấn cá nhân nếu phát hiện dương tính.

Giao mẫu tận nhà: với một số xét nghiệm nước tiểu, dịch tiết hoặc máu mao mạch (gói HomeTest).

👉 Phù hợp với: Người có quan hệ tình dục không an toàn, người đang điều trị STIs, cặp đôi trước khi kết hôn, người làm nghề tự do, người từng tiếp xúc nguy cơ cao.

🔐 Tuyệt đối bảo mật: GenderCare không lưu vết thanh toán nhạy cảm, cam kết ẩn danh nếu người dùng yêu cầu.`
  };

  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Tiêu đề bài viết ${i + 1}`,
    date: '14/05/2024',
    image: `/Images/baiviet${i + 1}.jpg`,
  }));

  const totalSlides = Math.ceil(posts.length / 3);
  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      <Header />
      <Navbar />

      <main className="flex-grow">
        {/* 🔽 Phần hiển thị riêng cho trang chủ */}
        {isHome && (
          <>
            {/* Hero section */}
            <section className="bg-gradient-to-r from-purple-100 via-pink-50 to-green-100 py-14">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 leading-tight">
                    Chăm sóc sức khỏe giới tính <br /> cho mọi lứa tuổi
                  </h1>
                  <p className="text-gray-700 text-lg">
                    GenderCare đồng hành cùng bạn và gia đình trên hành trình xây dựng sức khỏe tinh thần,
                    thể chất và giới tính an toàn, đúng đắn, nhân văn.
                  </p>
                  <button
                    onClick={handleScrollToService}
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                  >
                    Khám phá dịch vụ
                  </button>
                </div>
                <img
                  src={banner1}
                  alt="GenderCare Hero"
                  className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>
            </section>

            {/* Bài viết nổi bật Carousel */}
            <section className="max-w-7xl mx-auto p-6 space-y-6">
              <h2 className="text-2xl font-bold text-purple-700 text-center">Bài viết nổi bật</h2>
              <div className="relative">
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full w-8 h-8 flex items-center justify-center z-10"
                >
                  ❮
                </button>
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                  >
                    {Array.from({ length: totalSlides }).map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-full flex gap-6 px-1">
                        {posts.slice(i * 3, i * 3 + 3).map((post) => (
                          <article key={post.id} className="w-1/3 bg-white rounded-xl p-5 shadow hover:shadow-md transition border">
                            <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-md mb-3" />
                            <h3 className="text-lg font-bold text-purple-800">📌 {post.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">📅 {post.date}</p>
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`📄 ${post.title}\n\nabcxytz`);
                              }}
                              className="text-purple-600 hover:underline mt-2 inline-block text-sm"
                            >
                              Xem chi tiết →
                            </Link>
                          </article>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full w-8 h-8 flex items-center justify-center z-10"
                >
                  ❯
                </button>
              </div>
            </section>

            {/* Dịch vụ nổi bật */}
            <section
              ref={serviceRef}
              className="bg-gradient-to-r from-indigo-50 via-purple-50 to-green-50 py-16 mt-10"
            >
              <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-center text-3xl font-extrabold text-purple-700 mb-12">
                  🌸 Dịch vụ nổi bật tại GenderCare
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
                  {[
                    { title: 'Theo dõi chu kỳ kinh nguyệt', icon: '🩸' },
                    { title: 'Tư vấn sức khỏe giới tính', icon: '🧠' },
                    { title: 'Đặt lịch xét nghiệm STIs', icon: '🧪' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedService(item.title)}
                      className={`cursor-pointer bg-white px-6 py-10 rounded-xl shadow hover:shadow-lg transition border ${
                        selectedService === item.title ? 'ring-2 ring-purple-400' : ''
                      }`}
                    >
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <div className="font-semibold text-lg text-gray-700">{item.title}</div>
                    </div>
                  ))}
                </div>

                {selectedService && (
                  <div className="mt-12 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow border">
                    <h3 className="text-2xl font-bold text-purple-700 mb-4">{selectedService}</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify">
                      {serviceDetails[selectedService]}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* 🔁 Outlet cho các route con như /gioi-thieu/doi-ngu */}
        {!isHome && <Outlet />}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
