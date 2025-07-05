import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const pillTypes = [
  { value: 21, label: 'Vỉ 21 viên' },
  { value: 28, label: 'Vỉ 28 viên' },
];

const MedicationReminderForm: React.FC = () => {
  const [pillType, setPillType] = useState(21);
  const [reminderHour, setReminderHour] = useState(7);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await axiosInstance.post('/medication/schedule', {
        pillType,
        reminderHour,
        reminderMinute,
      });
      setMessage('Đã lưu lịch nhắc thuốc thành công!');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Lỗi khi lưu lịch nhắc thuốc.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Đăng ký nhắc uống thuốc</h2>
      <div>
        <label className="block mb-1">Loại vỉ thuốc</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={pillType}
          onChange={e => setPillType(Number(e.target.value))}
        >
          {pillTypes.map(pt => (
            <option key={pt.value} value={pt.value}>{pt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1">Giờ nhắc</label>
          <input
            type="number"
            min={0}
            max={23}
            className="w-full border rounded px-3 py-2"
            value={reminderHour}
            onChange={e => setReminderHour(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">Phút nhắc</label>
          <input
            type="number"
            min={0}
            max={59}
            className="w-full border rounded px-3 py-2"
            value={reminderMinute}
            onChange={e => setReminderMinute(Number(e.target.value))}
            required
          />
        </div>
      </div>
      {message && <div className="text-green-600 text-center">{message}</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? 'Đang lưu...' : 'Lưu lịch nhắc thuốc'}
      </button>
    </form>
  );
};

export default MedicationReminderForm; 