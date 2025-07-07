const LuuYSau = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-6">
        Lưu ý sau khi xét nghiệm
      </h1>
      <div className="w-[120px] h-[3px] bg-purple-800 mb-6"></div>

      <ul className="list-disc pl-6 space-y-2 text-gray-800 text-[15px]">
        <li>Giữ băng gạc tại chỗ lấy máu ít nhất 30 phút.</li>
        <li>Nghỉ ngơi nếu cảm thấy choáng, mệt sau khi lấy máu.</li>
        <li>Uống nhiều nước để hồi phục nhanh.</li>
        <li>Tuân thủ chỉ định của bác sĩ nếu có kết quả đặc biệt.</li>
      </ul>
    </div>
  );
};

export default LuuYSau;
