import React, { useState, useEffect } from 'react';
import { 
  getMyAppointments, 
  updateConsultationStatus, 
  markPatientNoShow, 
  cancelConsultation 
} from '../api/consultationApi';
import { ConsultationSchedule, ConsultationStatus } from '../types/consultation';
import type { ConsultationFilter as ConsultationFilterType } from '../types/consultation';
import ConsultationList from '../components/ConsultationList';
import ConsultationFilterComponent from '../components/ConsultationFilter';
import Header from '../components/header';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

const CounselorConsultations: React.FC = () => {
  const [consultations, setConsultations] = useState<ConsultationSchedule[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0
  });

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Tính toán thống kê
  useEffect(() => {
    const newStats = {
      total: consultations.length,
      pending: consultations.filter(c => c.status === ConsultationStatus.Pending).length,
      confirmed: consultations.filter(c => c.status === ConsultationStatus.Confirmed).length,
      completed: consultations.filter(c => c.status === ConsultationStatus.Completed).length,
      cancelled: consultations.filter(c => c.status === ConsultationStatus.Cancelled).length,
      noShow: consultations.filter(c => c.status === ConsultationStatus.NoShow).length
    };
    setStats(newStats);
  }, [consultations]);

  const fetchConsultations = async (filter?: ConsultationFilterType) => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await getMyAppointments(filter);
      setConsultations(response.data);
      setFilteredConsultations(response.data);
    } catch (error: any) {
      setMessage({
        text: error?.response?.data?.message || 'Không thể tải danh sách lịch tư vấn',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: ConsultationFilterType) => {
    fetchConsultations(filter);
  };

  const handleUpdateStatus = async (id: number, status: ConsultationStatus, reason?: string) => {
    try {
      setMessage(null);
      await updateConsultationStatus(id, status, reason);
      setMessage({
        text: 'Cập nhật trạng thái thành công',
        type: 'success'
      });
      fetchConsultations(); // Refresh danh sách
    } catch (error: any) {
      setMessage({
        text: error?.response?.data?.message || 'Không thể cập nhật trạng thái',
        type: 'error'
      });
    }
  };

  const handleMarkNoShow = async (id: number) => {
    try {
      setMessage(null);
      await markPatientNoShow(id);
      setMessage({
        text: 'Đánh dấu vắng mặt thành công',
        type: 'success'
      });
      fetchConsultations(); // Refresh danh sách
    } catch (error: any) {
      setMessage({
        text: error?.response?.data?.message || 'Không thể đánh dấu vắng mặt',
        type: 'error'
      });
    }
  };

  const handleCancel = async (id: number, reason?: string) => {
    try {
      setMessage(null);
      await cancelConsultation(id, reason || 'Tư vấn viên hủy lịch');
      setMessage({
        text: 'Hủy lịch thành công',
        type: 'success'
      });
      fetchConsultations(); // Refresh danh sách
    } catch (error: any) {
      setMessage({
        text: error?.response?.data?.message || 'Không thể hủy lịch',
        type: 'error'
      });
    }
  };

  const handleProposeReschedule = async (id: number) => {
    setMessage({
      text: 'Tính năng đề xuất đổi lịch sẽ được phát triển sau',
      type: 'info'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
        <Header />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách lịch tư vấn...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lịch tư vấn</h1>
          <p className="text-gray-600">Xem và quản lý các lịch tư vấn của bạn</p>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng cộng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Chờ xác nhận</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Đã xác nhận</p>
                <p className="text-2xl font-bold text-blue-900">{stats.confirmed}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <span className="text-2xl">🎉</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Đã hủy</p>
                <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
              </div>
              <span className="text-2xl">❌</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vắng mặt</p>
                <p className="text-2xl font-bold text-gray-900">{stats.noShow}</p>
              </div>
              <span className="text-2xl">🚫</span>
            </div>
          </div>
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

        {/* Bộ lọc */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Bộ lọc tìm kiếm</h3>
          <ConsultationFilterComponent onFilterChange={handleFilterChange} />
        </div>

        {/* Danh sách lịch tư vấn */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách lịch tư vấn
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Hiển thị {filteredConsultations.length} lịch tư vấn
              </p>
            </div>
            <button
              onClick={() => fetchConsultations()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <span>🔄</span>
              Làm mới
            </button>
          </div>

          <ConsultationList
            consultations={filteredConsultations}
            userRole="Counselor"
            onUpdateStatus={handleUpdateStatus}
            onMarkNoShow={handleMarkNoShow}
            onCancel={handleCancel}
            onProposeReschedule={handleProposeReschedule}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CounselorConsultations; 