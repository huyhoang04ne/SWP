import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getLoggedDates, logPeriodDates } from "../../api/menstrualApi";

const PeriodCalendarPage: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

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
      setMessage("Period dates saved successfully.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Error saving period data.");
    }
  };

  const handleSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates ?? []);
  };

  return (
    <div className="bg-white p-4 max-w-md mx-auto rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-center text-pink-600 mb-2">
        Tap on days to adjust periods
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
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
          Close
        </button>
        <button
          onClick={handleSave}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Save
        </button>
      </div>

      {message && (
        <p className="text-center text-sm mt-2 text-pink-500">{message}</p>
      )}
    </div>
  );
};

export default PeriodCalendarPage;
