import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenstrualCycleChart from "../../components/MenstrualCycleChart";
import CyclePhasePieChart from "../../components/CyclePhasePieChart";
import CycleStatistics from "../../components/CycleStatistics";
import { getLoggedDates, getAllPredictions } from "../../api/menstrualApi";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
};

// StatCard nội tuyến
const StatCard = ({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) => (
  <div className={`flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-4 border-t-4 ${color}`}>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-lg font-semibold text-gray-700">{label}</div>
    <div className="text-2xl font-bold text-purple-700">{value}</div>
  </div>
);

const CycleSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const prediction = location.state?.prediction;
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    getLoggedDates().then(dates => setSelectedDates(dates));
    getAllPredictions().then(data => setPredictions(data));
  }, []);

  if (!prediction) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Không có dữ liệu dự đoán.</p>
        <button
          onClick={() => navigate("/cycle-tracking")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Tìm prediction chứa ngày hiện tại
  const today = new Date();
  today.setHours(0,0,0,0);
  const currentPrediction = predictions.find(p => {
    const start = new Date(p.startDate);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(start.getDate() + (p.cycleLength || 28) - 1);
    return today >= start && today <= end;
  }) || prediction;

  // Tính số ngày vùng màu mỡ
  const fertileStart = new Date(currentPrediction.fertileStart);
  const fertileEnd = new Date(currentPrediction.fertileEnd);
  const fertileDays = (fertileStart && fertileEnd && !isNaN(fertileStart.getTime()) && !isNaN(fertileEnd.getTime()))
    ? Math.round((fertileEnd.getTime() - fertileStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Định dạng ngày đẹp
  const ovulationDateVN = formatDate(currentPrediction.ovulationDate);
  const nextPeriodDateVN =
    currentPrediction.predictedNextCycleStartDate ||
    (currentPrediction.startDate && currentPrediction.cycleLength
      ? formatDate(new Date(new Date(currentPrediction.startDate).setDate(new Date(currentPrediction.startDate).getDate() + currentPrediction.cycleLength)).toISOString())
      : "Chưa xác định"
    );
  const fertileStartVN = formatDate(currentPrediction.fertileStart);
  const fertileEndVN = formatDate(currentPrediction.fertileEnd);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Chu kỳ kinh nguyệt của bạn</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate('/cycle-tracking')}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow transition"
        >
          Chỉnh sửa chu kỳ kinh nguyệt
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🩸" label="Chu kỳ" value={`${currentPrediction.cycleLength || 28} ngày`} color="border-pink-400" />
        <StatCard icon="🌱" label="Vùng màu mỡ" value={`${fertileDays} ngày`} color="border-yellow-400" />
        <StatCard icon="🥚" label="Rụng trứng" value={ovulationDateVN} color="border-green-400" />
        <StatCard icon="🔜" label="Kỳ tiếp theo" value={nextPeriodDateVN} color="border-purple-400" />
      </div>
      {/* Box giải thích dữ liệu */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg my-6">
        <h3 className="font-semibold text-blue-700 mb-2 flex items-center"><span className="mr-2">ℹ️</span>Giải thích các dữ liệu và căn cứ tính toán</h3>
        <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
          <li>
            <b>Chu kỳ:</b> Số ngày giữa hai lần có kinh liên tiếp, được tính dựa trên các ngày bạn đã nhập vào hệ thống.
          </li>
          <li>
            <b>Vùng màu mỡ:</b> Là khoảng thời gian dễ thụ thai nhất, được tính động dựa trên dữ liệu backend trả về (thường là 7 ngày, từ <b>5 ngày trước</b> đến <b>1 ngày sau</b> ngày rụng trứng). <br/>
            <i>Điều này dựa trên nghiên cứu khoa học: tinh trùng có thể sống tối đa 5 ngày trong cơ thể phụ nữ, còn trứng chỉ sống khoảng 1 ngày sau khi rụng.</i>
          </li>
          <li>
            <b>Ngày rụng trứng:</b> Được dự đoán là <b>14 ngày trước khi bắt đầu kỳ kinh nguyệt tiếp theo</b>
            (tức là ngày thứ {currentPrediction.cycleLength - 14} tính từ ngày đầu kỳ kinh gần nhất).<br/>
            <i>Căn cứ theo khuyến nghị của Hiệp hội Sản phụ khoa Hoa Kỳ (ACOG).</i>
          </li>
          <li>
            <b>Kỳ tiếp theo:</b> Dự đoán dựa trên độ dài chu kỳ trung bình của bạn, giúp bạn chủ động theo dõi sức khỏe và kế hoạch cá nhân.
          </li>
        </ul>
        <div className="text-xs text-blue-600 mt-2">
          <b>Nguồn tham khảo:</b> <a href="https://www.medicalnewstoday.com/articles/322951#maximizing-fertility" target="_blank" rel="noopener noreferrer" className="underline">ACOG - Your Menstrual Cycle</a>, <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3131874/" target="_blank" rel="noopener noreferrer" className="underline">Nghiên cứu về tuổi thọ tinh trùng và trứng</a>
        </div>
      </div>
      <MenstrualCycleChart predictions={predictions} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CyclePhasePieChart prediction={currentPrediction} />
        <CycleStatistics prediction={currentPrediction} />
      </div>
    </div>
  );
};

export default CycleSummary; 