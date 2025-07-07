const CauHoiThuongGap = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-6">
        Câu hỏi thường gặp
      </h1>
      <div className="w-[120px] h-[3px] bg-purple-800 mb-6"></div>

      <div className="space-y-5 text-gray-800 text-[15px]">
        <div>
          <strong>❓ Tôi cần nhịn ăn bao lâu trước xét nghiệm?</strong>
          <p>Tuỳ vào loại xét nghiệm. Đa phần các xét nghiệm máu cần nhịn ăn 8–12 tiếng.</p>
        </div>
        <div>
          <strong>❓ Bao lâu có kết quả xét nghiệm?</strong>
          <p>Xét nghiệm nhanh có trong ngày. Một số xét nghiệm chuyên sâu cần 1–3 ngày làm việc.</p>
        </div>
        <div>
          <strong>❓ Tôi có được uống nước không?</strong>
          <p>Có thể uống nước lọc. Tránh đồ uống ngọt, có gas hoặc chứa caffeine.</p>
        </div>
        <div>
          <strong>❓ Có cần đặt lịch trước không?</strong>
          <p>Khuyến khích đặt lịch trước để được phục vụ nhanh và không phải chờ đợi.</p>
        </div>
      </div>
    </div>
  );
};

export default CauHoiThuongGap;
