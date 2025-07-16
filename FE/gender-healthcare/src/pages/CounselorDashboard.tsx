import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getMyAppointments } from '../api/consultationApi';
import { ConsultationSchedule, ConsultationStatus } from '../types/consultation';
import Header from '../components/header';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

const CounselorDashboard: React.FC = () => {
  const [consultations, setConsultations] = useState<ConsultationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    today: 0,
    upcoming: 0
  });

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    if (consultations.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const upcoming = new Date();
      upcoming.setDate(upcoming.getDate() + 7);

      const newStats = {
        total: consultations.length,
        pending: consultations.filter(c => c.status === ConsultationStatus.Pending).length,
        confirmed: consultations.filter(c => c.status === ConsultationStatus.Confirmed).length,
        completed: consultations.filter(c => c.status === ConsultationStatus.Completed).length,
        cancelled: consultations.filter(c => c.status === ConsultationStatus.Cancelled).length,
        noShow: consultations.filter(c => c.status === ConsultationStatus.NoShow).length,
        today: consultations.filter(c => 
          c.status === ConsultationStatus.Confirmed && 
          c.scheduledDate.startsWith(today)
        ).length,
        upcoming: consultations.filter(c => 
          c.status === ConsultationStatus.Confirmed && 
          new Date(c.scheduledDate) > new Date() &&
          new Date(c.scheduledDate) <= upcoming
        ).length
      };
      setStats(newStats);
    }
  }, [consultations]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await getMyAppointments();
      setConsultations(response.data);
    } catch (error: any) {
      console.error('Error fetching consultations:', error);
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: ConsultationStatus): string => {
    switch (status) {
      case ConsultationStatus.Pending: return 'bg-yellow-100 text-yellow-800';
      case ConsultationStatus.Confirmed: return 'bg-blue-100 text-blue-800';
      case ConsultationStatus.Completed: return 'bg-green-100 text-green-800';
      case ConsultationStatus.Cancelled: return 'bg-red-100 text-red-800';
      case ConsultationStatus.NoShow: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusName = (status: ConsultationStatus): string => {
    switch (status) {
      case ConsultationStatus.Pending: return 'Chờ xác nhận';
      case ConsultationStatus.Confirmed: return 'Đã xác nhận';
      case ConsultationStatus.Completed: return 'Đã hoàn thành';
      case ConsultationStatus.Cancelled: return 'Đã hủy';
      case ConsultationStatus.NoShow: return 'Vắng mặt';
      default: return 'Không xác định';
    }
  };

  const navItems = [
    {
      to: "/counselor-consultations",
      label: "Quản lý lịch tư vấn",
      icon: "📅",
      description: "Xem và quản lý tất cả lịch tư vấn"
    },
    {
      to: "/my-schedule",
      label: "Lịch làm việc",
      icon: "🕐",
      description: "Xem lịch làm việc của bạn"
    },
    {
      to: "/patient-records",
      label: "Hồ sơ bệnh nhân",
      icon: "📋",
      description: "Quản lý hồ sơ bệnh nhân"
    },
    {
      to: "/consultation-history",
      label: "Lịch sử tư vấn",
      icon: "📊",
      description: "Xem lịch sử các cuộc tư vấn"
    }
  ];

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
        <Header />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dashboard...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Tư vấn viên</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại! Đây là tổng quan về hoạt động của bạn</p>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng lịch tư vấn</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Chờ xác nhận</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Hôm nay</p>
                <p className="text-3xl font-bold text-blue-900">{stats.today}</p>
              </div>
              <span className="text-3xl">📅</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Tuần tới</p>
                <p className="text-3xl font-bold text-green-900">{stats.upcoming}</p>
              </div>
              <span className="text-3xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Thống kê chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Trạng thái lịch tư vấn</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đã xác nhận</span>
                <span className="font-semibold text-blue-600">{stats.confirmed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đã hoàn thành</span>
                <span className="font-semibold text-green-600">{stats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đã hủy</span>
                <span className="font-semibold text-red-600">{stats.cancelled}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vắng mặt</span>
                <span className="font-semibold text-gray-600">{stats.noShow}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Hành động nhanh</h3>
            <div className="space-y-3">
              <NavLink
                to="/counselor-consultations"
                className="block w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
              >
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span className="font-medium">Quản lý lịch tư vấn</span>
                </div>
              </NavLink>
              <NavLink
                to="/my-schedule"
                className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
              >
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span className="font-medium">Xem lịch làm việc</span>
                </div>
              </NavLink>
              <button
                onClick={fetchConsultations}
                className="block w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
              >
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span className="font-medium">Làm mới dữ liệu</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Hiệu suất</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
                <span className="font-semibold text-green-600">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ vắng mặt</span>
                <span className="font-semibold text-red-600">
                  {stats.total > 0 ? Math.round((stats.noShow / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ hủy</span>
                <span className="font-semibold text-orange-600">
                  {stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lịch tư vấn gần đây */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">📅 Lịch tư vấn gần đây</h3>
            <NavLink
              to="/counselor-consultations"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Xem tất cả →
            </NavLink>
          </div>
          
          {consultations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">📭</span>
              <p>Chưa có lịch tư vấn nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.slice(0, 5).map((consultation) => (
                <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {consultation.patient?.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {consultation.patient?.fullName || 'Bệnh nhân không xác định'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(consultation.scheduledDate)} - Ca {getTimeSlotName(consultation.timeSlot)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusName(consultation.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu chức năng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🛠️ Chức năng quản lý</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CounselorDashboard; 