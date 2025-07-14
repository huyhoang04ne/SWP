
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
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

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


  const postContents: { [key: number]: { title: string; content: string } } = {
    1: {
    title: 'Mục đích hệ thống GenderCare',
    content: `GenderCare được thành lập với sứ mệnh trở thành một nền tảng y tế chuyên biệt về chăm sóc sức khỏe giới tính và sinh sản cho cộng đồng Việt Nam. Trong bối cảnh xã hội ngày càng cởi mở hơn với các vấn đề về giới, tình dục và sức khỏe tâm lý, chúng tôi nhận thấy khoảng trống lớn trong việc cung cấp thông tin chính xác, dịch vụ y tế thân thiện và bảo mật cho mọi đối tượng – từ thanh thiếu niên mới bước vào tuổi dậy thì, đến người trưởng thành đang lập gia đình hoặc sống độc thân.

Mục tiêu của GenderCare là đồng hành với người dùng trên mọi chặng đường của sức khỏe giới tính: từ giáo dục giới tính cơ bản, tư vấn tâm lý cá nhân, theo dõi chu kỳ kinh nguyệt, đặt lịch xét nghiệm STIs, điều trị nội tiết cho người chuyển giới, cho đến hỗ trợ cặp đôi trong việc sinh sản an toàn. Chúng tôi tích hợp công nghệ hiện đại như AI phân tích chu kỳ, lịch thông minh, bảo mật dữ liệu y tế bằng mã hóa đầu cuối và khả năng tương tác trực tiếp với bác sĩ chỉ qua một vài thao tác trên điện thoại.`,
  },
    2: {
    title: 'Tầm nhìn sứ mệnh',
    content: `GenderCare không chỉ là một phòng khám – chúng tôi là một phong trào vì sức khỏe giới tính toàn diện. Tầm nhìn của chúng tôi là trở thành hệ sinh thái y tế tiên phong trong việc tích hợp y học, công nghệ và nhân văn học để phục vụ cộng đồng LGBTQ+, nữ giới, nam giới và các nhóm dân cư có nguy cơ cao.

Chúng tôi xây dựng hệ thống dựa trên ba trụ cột:

- Giáo dục (Cung cấp thông tin chuẩn xác, tránh kỳ thị và sai lệch).
- Can thiệp sớm (Tư vấn và tầm soát nguy cơ bệnh lý từ sớm).
- Cá nhân hóa (Tạo ra trải nghiệm riêng biệt cho từng người dùng).

Sứ mệnh của chúng tôi là đảm bảo mỗi người được quyền hiểu, chăm sóc và kiểm soát sức khỏe giới tính của chính mình mà không sợ bị phán xét. GenderCare cam kết xây dựng môi trường thân thiện, bảo mật, chuyên nghiệp, nơi mọi người đều được lắng nghe và hỗ trợ.`,
  },
  3: {
    title: 'Cơ sở vật chất hiện đại',
    content: `Tại GenderCare, chúng tôi không ngừng đầu tư vào cơ sở hạ tầng để mang đến trải nghiệm thăm khám y tế thoải mái, chuyên nghiệp và riêng tư nhất. Phòng khám được thiết kế theo tiêu chuẩn quốc tế với các khu vực chức năng riêng biệt: phòng khám sản phụ khoa, phòng lấy mẫu xét nghiệm STIs, phòng tư vấn tâm lý cá nhân, phòng chờ riêng cho từng nhóm đối tượng, và không gian thân thiện cho người chuyển giới.

Trang thiết bị được trang bị đầy đủ và hiện đại: máy siêu âm đầu dò, xét nghiệm nhanh HIV, PCR cho HPV và Chlamydia, hệ thống quản lý hồ sơ bệnh án điện tử. Chúng tôi còn áp dụng công nghệ lọc không khí, cách âm từng phòng và phân luồng đón tiếp linh hoạt để đảm bảo sự riêng tư tối đa.

Bên cạnh đó, phòng tư vấn được thiết kế ấm cúng, nhẹ nhàng với âm nhạc thư giãn, bảng vẽ và dụng cụ hỗ trợ trị liệu tâm lý. Mọi cơ sở đều có phòng WC không phân biệt giới tính và lối đi cho người khuyết tật.`,
  },
    4: {
    title: 'Giá thành hợp lý',
    content: `GenderCare tin rằng chăm sóc sức khỏe giới tính là quyền cơ bản của mỗi người, không phân biệt thu nhập. Do đó, chúng tôi xây dựng chính sách giá minh bạch và linh hoạt: người dùng có thể chọn dịch vụ đơn lẻ hoặc theo gói tiết kiệm (combo kiểm tra STIs + tư vấn + thuốc điều trị), kèm ưu đãi định kỳ cho sinh viên, học sinh và người chuyển giới.

Chúng tôi hợp tác với các tổ chức NGO và doanh nghiệp xã hội để tài trợ dịch vụ xét nghiệm miễn phí cho nhóm nguy cơ cao như lao động tình dục, cộng đồng LGBTQ+, người có HIV hoặc sống ở khu vực nông thôn.

Dù bạn đến GenderCare để xét nghiệm, tư vấn hay theo dõi sức khỏe sinh sản, bạn đều có thể yên tâm rằng sẽ không có chi phí phát sinh ẩn, không bị ép mua thuốc và luôn được thông báo rõ về các lựa chọn điều trị.`,
  },
  5: {
    title: 'Dịch vụ theo dõi chu kỳ kinh nguyệt',
    content: `Hệ thống theo dõi chu kỳ kinh nguyệt của GenderCare được phát triển dựa trên nhu cầu thực tế của người dùng, kết hợp cùng tư vấn của các chuyên gia y khoa và công nghệ. Giao diện lịch chu kỳ tương tác trực quan cho phép người dùng dễ dàng nhập kỳ kinh, theo dõi triệu chứng PMS, ghi chú tâm trạng và đánh dấu các dấu hiệu bất thường như rong kinh, ra máu giữa kỳ hoặc trễ kinh.

Tính năng AI phân tích dữ liệu giúp cá nhân hóa các dự đoán rụng trứng, ngày dễ thụ thai và các cảnh báo y tế nếu phát hiện chu kỳ lệch quá 7 ngày liên tiếp. Ứng dụng còn đồng bộ với Google Calendar để nhắc lịch uống thuốc tránh thai, tiêm ngừa HPV hoặc đi khám phụ khoa định kỳ.

Chế độ riêng dành cho các bạn học sinh hoặc người lập kế hoạch mang thai được thiết kế với ngôn ngữ thân thiện, dễ hiểu nhưng vẫn khoa học, bảo mật cao. Người dùng có thể trích xuất dữ liệu ra PDF gửi cho bác sĩ điều trị hoặc lưu trữ lâu dài trên hệ thống.`,
  },
  6: {
    title: 'Dịch vụ trao đổi với tư vấn viên',
    content: `Bạn đang bối rối về giới tính, quan hệ tình dục, lo lắng về mang thai ngoài ý muốn, hay khủng hoảng tâm lý vì bị kỳ thị? Hãy đến với dịch vụ tư vấn tại GenderCare – nơi bạn có thể tâm sự với chuyên gia không phán xét, không tiết lộ thông tin cá nhân và luôn đặt sự thấu cảm lên hàng đầu.

Chúng tôi có đội ngũ tư vấn viên gồm: bác sĩ chuyên khoa giới tính, chuyên gia tâm lý lâm sàng, chuyên gia trị liệu cho người chuyển giới, nhà giáo dục giới tính và cố vấn đồng hành LGBTQ+. Người dùng có thể chọn người tư vấn theo độ tuổi, giới tính, chuyên môn và hình thức tư vấn (trực tuyến, điện thoại, tại cơ sở).

Mỗi phiên tư vấn kéo dài 45–60 phút, có thể ghi nhật ký cảm xúc, vẽ sơ đồ suy nghĩ hoặc đơn giản là lắng nghe và khóc nếu bạn cần. GenderCare cam kết không lưu trữ nội dung buổi tư vấn, chỉ lưu thông tin hành chính cơ bản để phục vụ chăm sóc dài hạn (nếu bạn đồng ý).`,
  },
    7: {
    title: 'Các chuyên gia hàng đầu trong y tế',
    content: `Chúng tôi tự hào quy tụ đội ngũ bác sĩ, cố vấn và chuyên gia đầu ngành đến từ các bệnh viện lớn như Từ Dũ, Hùng Vương, Nhi Đồng, Bạch Mai và các tổ chức quốc tế như WHO, PATH, UNAIDS. Họ không chỉ giỏi chuyên môn mà còn có lòng trắc ẩn, hiểu cộng đồng LGBTQ+, người trẻ và người có hoàn cảnh nhạy cảm.

GenderCare tổ chức đào tạo định kỳ cho nhân viên y tế về kỹ năng giao tiếp không định kiến, hiểu biết về đa dạng giới và bảo mật thông tin người dùng. Mỗi chuyên gia đều có hồ sơ công khai trên website với bằng cấp, chuyên môn, kinh nghiệm để người dùng dễ dàng lựa chọn.

Bên cạnh đó, chúng tôi còn cộng tác với các chuyên gia quốc tế để hỗ trợ người chuyển giới đang trong quá trình dùng hormone, xét nghiệm nội tiết định kỳ và tư vấn chuyển giới an toàn theo chuẩn WPATH.`,
  },
  8: {
    title: 'Dịch vụ xét nghiệm và điều trị STIs',
    content: `GenderCare cung cấp dịch vụ xét nghiệm và điều trị STIs toàn diện từ A-Z. Người dùng có thể đặt lịch online, chọn xét nghiệm nhanh tại cơ sở hoặc nhận bộ test tại nhà (nước tiểu, dịch tiết âm đạo, máu mao mạch). Các bệnh được xét nghiệm bao gồm: HIV, giang mai, lậu, chlamydia, HPV, herpes, viêm gan B/C...

Kết quả được trả nhanh (từ 30 phút đến 48h) qua email bảo mật hoặc trực tiếp tại phòng khám. Nếu kết quả dương tính, bạn sẽ được tư vấn chuyên sâu, kê toa thuốc phù hợp hoặc chuyển tuyến điều trị nếu cần thiết.

GenderCare cam kết không lưu thông tin thanh toán nhạy cảm và cung cấp dịch vụ “ẩn danh tuyệt đối” nếu bạn yêu cầu. Dịch vụ hậu xét nghiệm bao gồm hỗ trợ tâm lý, điều trị bạn tình (nếu được phép) và cung cấp tài liệu tự học.`,
  },
  9: {
    title: 'Câu hỏi thường gặp',
    content: `Để giúp người dùng dễ dàng tiếp cận và sử dụng các dịch vụ của GenderCare, chúng tôi xây dựng kho câu hỏi thường gặp (FAQ) chia theo chủ đề: đặt lịch, hủy lịch, bảo mật thông tin, quy trình xét nghiệm, chi phí, cách tư vấn...

Bạn có thể tìm thấy câu trả lời cho các thắc mắc như:

- Tôi có thể dùng tên giả khi đi xét nghiệm không?
- Làm sao để hẹn tư vấn với chuyên gia nữ?
- Tôi 17 tuổi, có được phép dùng dịch vụ không?
- Dữ liệu của tôi có bị chia sẻ với người thân hay công ty bảo hiểm không?
- Dịch vụ có hỗ trợ người chuyển giới đang dùng hormone không?

Ngoài ra, nếu bạn không tìm thấy câu hỏi phù hợp, bạn có thể gửi yêu cầu ẩn danh đến đội ngũ GenderCare qua biểu mẫu hoặc chatbot để được trả lời cá nhân hóa trong vòng 24h.`,
  },
  };

  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: postContents[i + 1].title,
    date: '14/05/2024',
    image: `/images/baiviet${i + 1}.jpg`,
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
        {isHome && (
          <>
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
                                setSelectedPost(post.id);
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

              {selectedPost && (
                <div className="mt-10 bg-white border rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">
                    {postContents[selectedPost].title}
                  </h3>
                  <img
                    src={`/images/baiviet${selectedPost}.jpg`}
                    alt={postContents[selectedPost].title}
                    className="w-full h-64 object-cover rounded mb-4"
                  />
                  <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                    {postContents[selectedPost].content}
                  </p>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </section>

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
                      className={`cursor-pointer bg-white px-6 py-10 rounded-xl shadow hover:shadow-lg transition border ${selectedService === item.title ? 'ring-2 ring-purple-400' : ''}`}
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

        {!isHome && <Outlet />}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
