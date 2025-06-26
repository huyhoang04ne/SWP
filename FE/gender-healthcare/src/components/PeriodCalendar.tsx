import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getLoggedDates, logPeriodDates } from "../api/menstrualApi"; // API riêng

const PeriodCalendar: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLoggedDates = async () => {
      try {
        const dates = await getLoggedDates();
        setSelectedDates(dates);
      } catch (error) {
        console.error("Failed to fetch logged dates", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedDates();
  }, []);

  const handleSave = async () => {
    try {
      await logPeriodDates(selectedDates);
      alert("Đã lưu kỳ kinh thành công!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Lỗi khi lưu kỳ kinh.");
    }
  };

  const handleSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates ?? []);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow max-w-xl mx-auto space-y-4">
      <h2 className="text-lg font-semibold text-pink-600">
        Tap on days to adjust periods
      </h2>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <DayPicker
          mode="multiple"
          selected={selectedDates}
          onSelect={handleSelect}
          required={false}
          showOutsideDays={true}
          modifiersClassNames={{ selected: "bg-pink-500 text-white" }}
          className="rounded-lg border border-pink-300 shadow p-2"
        />
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setSelectedDates([])}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Close
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PeriodCalendar;