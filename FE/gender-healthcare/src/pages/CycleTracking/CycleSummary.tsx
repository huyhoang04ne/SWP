import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
};

const CycleSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const prediction = location.state?.prediction;

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

  return (
    <div className="bg-white max-w-xl mx-auto mt-10 p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
        Chu kỳ dự đoán
      </h1>
      <div className="space-y-4 text-center text-lg">
        <p>
          <strong>Ngày rụng trứng:</strong> {formatDate(prediction.ovulationDate)}
        </p>
        <p>
          <strong>Vùng màu mỡ:</strong> {formatDate(prediction.fertileStart)} -{" "}
          {formatDate(prediction.fertileEnd)}
        </p>
        <p>
          <strong>Mức độ thụ thai hôm nay:</strong>{" "}
          {prediction.status || "N/A"}
        </p>
        <p>
          <strong>Trạng thái kỳ kinh tiếp theo:</strong>{" "}
          {prediction.periodStatus || "N/A"}
        </p>
        <p>
          <strong>Ngày dự đoán có kinh tiếp theo:</strong>{" "}
          {formatDate(prediction.nextPeriodDate)}
        </p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/")}
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default CycleSummary;
