import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import Header from '../components/header';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

interface WorkingSchedule {
  id: number;
  date: string;
  timeSlot: number;
  isAvailable: boolean;
  assignedBy: string;
  isAutoAssigned: boolean;
}

const MySchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<WorkingSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchMySchedule();
  }, [selectedMonth]);

  const fetchMySchedule = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await axios.get(`/schedule/my-schedule?month=${selectedMonth}`);
      setSchedules(response.data);
    } catch (error: any) {
      setMessage({
        text: error?.response?.data?.message || 'Không thể tải lịch làm việc',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotName = (timeSlot: number): string => {
    switch (timeSlot) {
      case 0: return 'Sáng';
      case 1: return 'Chiều';
      case 2: return 'Tối';
      default: return 'Không xác định';
    }
  };

  const getTimeSlotColor = (timeSlot: number): string => {
    switch (timeSlot) {
      case 0: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 1: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 2: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthName = (monthString: string): string => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' });
  };

  const generateCalendarDays = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate.getMonth() <= month - 1 && days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getScheduleForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedules.filter(s => s.date === dateString);
  };

  const isCurrentMonth = (date: Date) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
        <Header />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải lịch làm việc...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      <Header />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch làm việc của tôi</h1>
          <p className="text-gray-600">Xem lịch làm việc và ca được phân công</p>
        </div>

        {/* Thông báo */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg shadow-sm border animate-fade-in ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : message.type === 'error'
              ? 'bg-red-50 border-red-400 text-red-700'
              : 'bg-blue-50 border-blue-400 text-blue-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {message.type === 'success' ? '✅' : message.type === 'error' ? '❗' : 'ℹ️'}
                </span>
                <span className="font-medium">{message.text}</span>
              </div>
              <button
                onClick={() => setMessage(null)}
                className="ml-2 text-lg font-bold focus:outline-none hover:opacity-70"
                aria-label="Đóng thông báo"
                type="button"
              >×</button>
            </div>
          </div>
        )}

        {/* Chọn tháng */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📅 Chọn tháng</h3>
            <button
              onClick={fetchMySchedule}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <span>🔄</span>
              Làm mới
            </button>
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            Đang xem lịch làm việc tháng {getMonthName(selectedMonth)}
          </p>
        </div>

        {/* Lịch làm việc */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">📋 Lịch làm việc chi tiết</h3>
          
          {/* Calendar View */}
          <div className="mb-8">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-100 rounded-lg">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((date, index) => {
                const daySchedules = getScheduleForDate(date);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDate = isToday(date);
                
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border border-gray-200 rounded-lg ${
                      isCurrentMonthDay ? 'bg-white' : 'bg-gray-50'
                    } ${isTodayDate ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'
                    } ${isTodayDate ? 'text-purple-600 font-bold' : ''}`}>
                      {date.getDate()}
                    </div>
                    
                    {isCurrentMonthDay && daySchedules.length > 0 && (
                      <div className="space-y-1">
                        {daySchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`text-xs px-2 py-1 rounded border ${getTimeSlotColor(schedule.timeSlot)} ${
                              schedule.isAvailable ? 'opacity-100' : 'opacity-60'
                            }`}
                          >
                            {getTimeSlotName(schedule.timeSlot)}
                            {!schedule.isAvailable && ' (Đã book)'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* List View */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">📝 Danh sách ca làm việc</h4>
            {schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">📭</span>
                <p>Không có ca làm việc nào trong tháng này</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-4 rounded-lg border ${
                      schedule.isAvailable 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTimeSlotColor(schedule.timeSlot)}`}>
                          Ca {getTimeSlotName(schedule.timeSlot)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{formatDate(schedule.date)}</p>
                          <p className="text-sm text-gray-600">
                            {schedule.isAvailable ? '🟢 Rảnh' : '🔴 Đã có lịch hẹn'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {schedule.isAutoAssigned ? 'Tự động phân' : `Phân bởi: ${schedule.assignedBy}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MySchedule; 