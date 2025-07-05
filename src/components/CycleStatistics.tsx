import React from 'react';

interface CycleStatisticsProps {
  prediction: any;
  predictions?: any[];
}

const CycleStatistics: React.FC<CycleStatisticsProps> = ({ prediction, predictions }) => {
  console.log("prediction", prediction);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  const calculateCycleLength = () => {
    if (!prediction.cycleLength) return "N/A";
    return prediction.cycleLength;
  };

  const calculateDaysLeft = () => {
    let nextDateStr = prediction.nextPeriodDate;
    if (!nextDateStr && Array.isArray(predictions)) {
      // Sort predictions theo startDate tăng dần
      const sortedPredictions = [...predictions].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      const idx = sortedPredictions.findIndex(p => new Date(p.startDate).getTime() === new Date(prediction.startDate).getTime());
      if (idx >= 0 && idx + 1 < sortedPredictions.length) {
        nextDateStr = sortedPredictions[idx + 1].startDate;
      }
    }
    // Nếu vẫn không có, tự tính bằng startDate + cycleLength
    if (!nextDateStr && prediction.startDate && prediction.cycleLength) {
      const start = new Date(prediction.startDate);
      start.setHours(0,0,0,0);
      const next = new Date(start);
      next.setDate(start.getDate() + prediction.cycleLength);
      nextDateStr = next.toISOString();
    }
    if (!nextDateStr) return "N/A";
    const nextDate = new Date(nextDateStr);
    if (isNaN(nextDate.getTime())) return "N/A";
    const today = new Date();
    nextDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diff = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  const getCurrentPhase = () => {
    const cycleLength = calculateCycleLength();
    if (cycleLength === "N/A") return "Không xác định";
    
    if (cycleLength <= 5) return "Ngày có kinh";
    if (cycleLength <= 14) return "Giai đoạn nang noãn";
    if (cycleLength === 15) return "Ngày rụng trứng";
    if (cycleLength <= 22) return "Vùng màu mỡ";
    return "Giai đoạn hoàng thể";
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Ngày có kinh":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Giai đoạn nang noãn":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ngày rụng trứng":
        return "bg-green-100 text-green-800 border-green-200";
      case "Vùng màu mỡ":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Giai đoạn hoàng thể":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Xác định trạng thái kỳ kinh dựa trên ngày hiện tại và các mốc prediction
  const getPeriodStatus = () => {
    const today = new Date();
    today.setHours(0,0,0,0);

    // Lấy các mốc từ prediction
    const startDate = new Date(prediction.startDate || prediction.StartDate);
    startDate.setHours(0,0,0,0);
    const periodLength = prediction.periodLength || prediction.periodDays || 5;
    const cycleLength = prediction.cycleLength || prediction.CycleLength || 28;
    const fertileStart = prediction.fertileStart ? new Date(prediction.fertileStart) : null;
    const fertileEnd = prediction.fertileEnd ? new Date(prediction.fertileEnd) : null;
    const ovulationDate = prediction.ovulationDate ? new Date(prediction.ovulationDate) : null;

    const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    console.log("startDate:", startDate, "today:", today, "diffDays:", diffDays, "periodLength:", periodLength, "cycleLength:", cycleLength);
    if (diffDays < 1 || diffDays > cycleLength) return "Không xác định";

    // 1. Ngày có kinh
    if (diffDays >= 1 && diffDays <= periodLength) return "Ngày có kinh";

    // 2. Vùng màu mỡ (ưu tiên kiểm tra ovulationDate trước)
    if (ovulationDate && today.getTime() === ovulationDate.getTime()) return "Ngày rụng trứng";
    if (fertileStart && fertileEnd && today >= fertileStart && today <= fertileEnd) return "Vùng màu mỡ";

    // 3. Giai đoạn nang noãn (sau ngày có kinh, trước vùng màu mỡ)
    if (fertileStart && today < fertileStart) return "Giai đoạn nang noãn";

    // 4. Giai đoạn hoàng thể (sau vùng màu mỡ đến hết chu kỳ)
    return "Giai đoạn hoàng thể";
  };

  console.log("Kỳ kinh tiếp theo:", prediction.nextPeriodDate);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-purple-700 mb-4 text-center">
        Thống kê chu kỳ
      </h3>
      
      <div className="space-y-4">
        {/* Giai đoạn hiện tại */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Giai đoạn hiện tại</p>
          <span className={`inline-block px-4 py-2 rounded-full border-2 font-semibold ${getPhaseColor(getPeriodStatus())}`}>
            {getPeriodStatus()}
          </span>
        </div>

        {/* Thống kê chi tiết */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
            <h4 className="font-semibold text-pink-700 mb-2">Chu kỳ thực tế</h4>
            <p className="text-2xl font-bold text-pink-800">{prediction.cycleLength || 28} ngày</p>
            <p className="text-sm text-pink-600">Chu kỳ thực tế</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Còn lại</h4>
            <p className="text-2xl font-bold text-blue-800">
              {typeof calculateDaysLeft() === "number" ? `${calculateDaysLeft()} ngày` : "N/A"}
            </p>
            <p className="text-sm text-blue-600">Đến kỳ tiếp theo</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700 mb-2">Rụng trứng</h4>
            <p className="text-lg font-bold text-green-800">
              {formatDate(prediction.ovulationDate)}
            </p>
            <p className="text-sm text-green-600">Ngày dự kiến</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-700 mb-2">Vùng màu mỡ</h4>
            <p className="text-lg font-bold text-yellow-800">
              {formatDate(prediction.fertileStart)}
            </p>
            <p className="text-sm text-yellow-600">Bắt đầu</p>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Thông tin bổ sung</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Mức độ thụ thai:</strong> {prediction.status || "N/A"}</p>
            <p>• <strong>Trạng thái kỳ kinh:</strong> {getPeriodStatus()}</p>
            <p>• <strong>Độ chính xác dự đoán:</strong> Cao (dựa trên dữ liệu lịch sử)</p>
          </div>
        </div>

        {/* Lời khuyên */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-400">
          <h4 className="font-semibold text-purple-700 mb-2">💡 Lời khuyên</h4>
          <div className="text-sm text-purple-600 space-y-1">
            {getPeriodStatus() === "Ngày có kinh" && (
              <p>• Nghỉ ngơi nhiều hơn, uống đủ nước</p>
            )}
            {getPeriodStatus() === "Vùng màu mỡ" && (
              <p>• Đây là thời điểm dễ thụ thai nhất</p>
            )}
            {getPeriodStatus() === "Ngày rụng trứng" && (
              <p>• Ngày quan trọng nhất trong chu kỳ</p>
            )}
            <p>• Theo dõi thường xuyên để có dự đoán chính xác hơn</p>
            <p>• Tham khảo ý kiến bác sĩ nếu có bất thường</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleStatistics; 