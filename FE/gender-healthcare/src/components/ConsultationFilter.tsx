import React, { useState } from 'react';
import { ConsultationStatus } from '../types/consultation';
import type { ConsultationFilter } from '../types/consultation';

interface ConsultationFilterProps {
  onFilterChange: (filter: ConsultationFilter) => void;
}

const ConsultationFilterComponent: React.FC<ConsultationFilterProps> = ({ onFilterChange }) => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [status, setStatus] = useState<ConsultationStatus | ''>('');

  const handleFilterChange = () => {
    const filter: ConsultationFilter = {};
    
    if (fromDate) filter.fromDate = fromDate;
    if (toDate) filter.toDate = toDate;
    if (status) filter.status = status as ConsultationStatus;
    
    onFilterChange(filter);
  };

  const handleQuickFilter = (type: 'today' | 'week' | 'month' | 'clear') => {
    const today = new Date();
    
    switch (type) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        setFromDate(todayStr);
        setToDate(todayStr);
        setStatus('');
        onFilterChange({ fromDate: todayStr, toDate: todayStr });
        break;
        
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startStr = startOfWeek.toISOString().split('T')[0];
        const endStr = endOfWeek.toISOString().split('T')[0];
        
        setFromDate(startStr);
        setToDate(endStr);
        setStatus('');
        onFilterChange({ fromDate: startStr, toDate: endStr });
        break;
        
      case 'month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const startMonthStr = startOfMonth.toISOString().split('T')[0];
        const endMonthStr = endOfMonth.toISOString().split('T')[0];
        
        setFromDate(startMonthStr);
        setToDate(endMonthStr);
        setStatus('');
        onFilterChange({ fromDate: startMonthStr, toDate: endMonthStr });
        break;
        
      case 'clear':
        setFromDate('');
        setToDate('');
        setStatus('');
        onFilterChange({});
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Lọc lịch tư vấn</h3>
      
      {/* Quick filters */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleQuickFilter('today')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Hôm nay
        </button>
        <button
          onClick={() => handleQuickFilter('week')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Tuần này
        </button>
        <button
          onClick={() => handleQuickFilter('month')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Tháng này
        </button>
        <button
          onClick={() => handleQuickFilter('clear')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Xóa bộ lọc
        </button>
      </div>

      {/* Custom filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ConsultationStatus | '')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value={ConsultationStatus.Pending}>Chờ xác nhận</option>
            <option value={ConsultationStatus.Confirmed}>Đã xác nhận</option>
            <option value={ConsultationStatus.Completed}>Đã hoàn thành</option>
            <option value={ConsultationStatus.Cancelled}>Đã hủy</option>
            <option value={ConsultationStatus.NoShow}>Vắng mặt</option>
          </select>
        </div>
      </div>

      {/* Apply filter button */}
      <div className="mt-4">
        <button
          onClick={handleFilterChange}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ConsultationFilterComponent; 