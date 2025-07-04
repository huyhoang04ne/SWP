import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  getLoggedDates,
  logPeriodDates,
  getPrediction,
} from "../../api/menstrualApi";
import { useNavigate } from "react-router-dom";

const PeriodCalendarPage: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoggedDates = async () => {
      try {
        const dates = await getLoggedDates();
        setSelectedDates(dates);
      } catch (error) {
        console.error("❌ Failed to fetch logged dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedDates();
  }, []);

  const handleSave = async () => {
    if (selectedDates.length === 0) {
      setMessage("Vui lòng chọn ít nhất một ngày.");
      return;
    }

    // Sắp xếp các ngày theo thứ tự tăng dần
    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    // Tìm ngày đầu tiên của mỗi chu kỳ (chuỗi ngày liên tiếp)
    const firstDays: Date[] = [];
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        firstDays.push(sortedDates[i]);
      } else {
        const prev = sortedDates[i - 1];
        const curr = sortedDates[i];
        // Nếu ngày hiện tại không liên tiếp với ngày trước đó (khác nhau > 1 ngày), thì là đầu chu kỳ mới
        const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 1) {
          firstDays.push(curr);
        }
      }
    }
    // Kiểm tra khoảng cách giữa các ngày đầu chu kỳ
    for (let i = 1; i < firstDays.length; i++) {
      const diffDays = Math.floor((firstDays[i].getTime() - firstDays[i - 1].getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 21 || diffDays > 35) {
        setMessage("Khoảng cách giữa các kỳ kinh nguyệt phải từ 21 đến 35 ngày (tính từ ngày đầu của mỗi kỳ). Vui lòng kiểm tra lại!");
        return;
      }
    }

    try {
      setSaving(true);
      setMessage("");

      await logPeriodDates(selectedDates);
      // Gọi lại API để cập nhật danh sách ngày từ backend
      const dates = await getLoggedDates();
      setSelectedDates(dates);

      const prediction = await getPrediction();
      console.log("🔍 Prediction received:", prediction);

      navigate("/cycle-summary", { state: { prediction, selectedDates: dates } });
    } catch (error: any) {
      console.error("❌ Error saving or predicting:", error);
      setMessage(
        error?.response?.data?.message || "Đã xảy ra lỗi khi lưu dữ liệu."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates ?? []);
  };

  return (
    <div className="bg-white p-4 max-w-md mx-auto rounded-lg shadow-md mt-6">
      <h1 className="text-xl font-bold text-center text-pink-600 mb-2">
        Tap on days to adjust periods
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <DayPicker
          mode="multiple"
          selected={selectedDates}
          onSelect={handleSelect}
          showOutsideDays
          modifiersClassNames={{ selected: "bg-pink-600 text-white" }}
          className="rounded-md border border-pink-200 shadow-sm p-2"
        />
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setSelectedDates([])}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Đóng
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>

      {message && (
        <p className="text-center text-sm mt-2 text-pink-500">{message}</p>
      )}
    </div>
  );
};

export default PeriodCalendarPage;
