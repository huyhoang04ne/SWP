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

  if (prediction) {
    console.log("Kỳ kinh tiếp theo FE render:", prediction.nextPeriodDate, typeof prediction.nextPeriodDate);
  }

  // Tìm prediction chứa ngày hiện tại
  const today = new Date();
  today.setHours(0,0,0,0);
  const currentPrediction = predictions.find(p => {
    const start = new Date(p.startDate || p.StartDate);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(start.getDate() + (p.cycleLength || p.CycleLength || 28) - 1);
    return today >= start && today <= end;
  }) || prediction;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Biểu đồ chu kỳ kinh nguyệt
      </h1>
      
      {/* Biểu đồ chính */}
      <div className="mb-8 chart-center">
        <MenstrualCycleChart predictions={predictions} />
      </div>

      {/* Biểu đồ tròn và thống kê */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CyclePhasePieChart prediction={currentPrediction} />
        <CycleStatistics prediction={currentPrediction} />
      </div>

      {/* Thông tin chi tiết */}
      <div className="bg-white max-w-2xl mx-auto p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Thông tin chu kỳ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-pink-700 mb-2">Chu kỳ</h3>
              <p className="text-2xl font-bold text-pink-800">{currentPrediction.cycleLength || 28} ngày</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700 mb-2">Vùng màu mỡ</h3>
              <p className="text-lg">
                {formatDate(currentPrediction.fertileStart)} - {formatDate(currentPrediction.fertileEnd)}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Mức độ thụ thai hôm nay</h3>
              <p className="text-lg">{currentPrediction.status || "N/A"}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">Kỳ kinh tiếp theo</h3>
              <p className="text-lg">
                {formatDate(
                  currentPrediction.nextPeriodDate ||
                  (currentPrediction.startDate && currentPrediction.cycleLength
                    ? new Date(new Date(currentPrediction.startDate).setDate(new Date(currentPrediction.startDate).getDate() + currentPrediction.cycleLength)).toISOString()
                    : undefined
                  )
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/cycle-tracking")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
          >
            Cập nhật dữ liệu
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CycleSummary; 