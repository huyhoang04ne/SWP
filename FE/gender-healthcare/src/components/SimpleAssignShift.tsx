import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

interface Counselor {
  id: string;
  fullName: string;
}

const SHIFT_OPTIONS = [
  { id: 0, name: 'Sáng', time: '08:00 - 12:00' },
  { id: 1, name: 'Chiều', time: '13:00 - 17:00' },
  { id: 2, name: 'Tối', time: '18:00 - 22:00' }
];

const SimpleAssignShift: React.FC = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await axiosInstance.get('/counselor');
      if (Array.isArray(response.data)) {
        setCounselors(response.data);
      } else {
        setCounselors([]);
      }
    } catch (error) {
      setCounselors([]);
      console.error('Error fetching counselors:', error);
    }
  };

  const handleShiftToggle = (shiftId: number) => {
    setSelectedShifts((prev) =>
      prev.includes(shiftId)
        ? prev.filter((id) => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!selectedCounselor) {
      setMessage('Vui lòng chọn tư vấn viên');
      return;
    }
    if (!selectedDate) {
      setMessage('Vui lòng chọn ngày');
      return;
    }
    if (selectedShifts.length === 0) {
      setMessage('Vui lòng chọn ít nhất một ca làm việc');
      return;
    }
    setLoading(true);
    try {
      const req = {
        counselorId: selectedCounselor,
        assignments: [
          {
            date: selectedDate.format('YYYY-MM-DD'),
            shiftIds: selectedShifts,
          },
        ],
      };
      const response = await axiosInstance.post('/schedule/assign-multi', req);
      if (response.data.success) {
        setMessage('Phân ca thành công!');
        setSelectedShifts([]);
        setSelectedDate(null);
        setSelectedCounselor('');
      } else {
        setMessage('Có lỗi xảy ra khi phân ca');
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi phân ca');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Phân Ca Đơn Giản</h2>
      {/* Dropdown chọn tư vấn viên */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-6 justify-center">
        <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-0 md:mr-2 min-w-[120px]">Tư vấn viên</label>
        <select
          value={selectedCounselor}
          onChange={(e) => setSelectedCounselor(e.target.value)}
          className="w-full md:w-72 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Chọn tư vấn viên...</option>
          {counselors.map((c) => (
            <option key={c.id} value={c.id}>{c.fullName}</option>
          ))}
        </select>
      </div>
      {/* Bố cục 2 cột: Calendar và ca làm việc */}
      <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Calendar lớn bên trái */}
        <div className="bg-gray-50 rounded-xl p-4 shadow w-full md:w-[340px] flex flex-col items-center">
          <h3 className="font-semibold text-gray-700 mb-2">Chọn ngày</h3>
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedShifts([]);
            }}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Chọn ngày..."
            format="DD/MM/YYYY"
            numberOfMonths={1}
            style={{ fontSize: '1.1rem' }}
          />
        </div>
        {/* Ca làm việc bên phải */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 shadow min-h-[260px] w-full">
          <h3 className="font-semibold text-gray-700 mb-4">Chọn ca làm việc</h3>
          {selectedDate ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {SHIFT_OPTIONS.map((shift) => (
                <button
                  type="button"
                  key={shift.id}
                  onClick={() => handleShiftToggle(shift.id)}
                  className={`py-4 px-6 rounded-lg border text-base font-semibold transition-colors shadow-sm
                    ${selectedShifts.includes(shift.id)
                      ? 'bg-blue-600 text-white border-blue-600 scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}
                  `}
                >
                  <div>{shift.name}</div>
                  <div className="text-xs mt-1">{shift.time}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-8">Hãy chọn ngày để hiện ca làm việc</div>
          )}
        </div>
      </div>
      {/* Nút phân ca và thông báo */}
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-1/2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-bold"
        >
          {loading ? 'Đang phân ca...' : 'Phân Ca'}
        </button>
        {message && (
          <div className={`p-3 rounded-md text-center w-full md:w-1/2 ${
            message.includes('thành công')
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default SimpleAssignShift; 