import React, { useState } from 'react';
import AdminPaymentReconciliation from '../components/AdminPaymentReconciliation';
import Header from '../components/header';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

type AdminTab = 'overview' | 'payments' | 'consultations' | 'users';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: '📊' },
    { id: 'payments', label: 'Đối soát thanh toán', icon: '💳' },
    { id: 'consultations', label: 'Quản lý lịch hẹn', icon: '📅' },
    { id: 'users', label: 'Quản lý người dùng', icon: '👥' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan hệ thống</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Tổng lịch hẹn</p>
                    <p className="text-2xl font-bold text-blue-900">156</p>
                  </div>
                  <span className="text-3xl">📅</span>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Đã thanh toán</p>
                    <p className="text-2xl font-bold text-green-900">89</p>
                  </div>
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Chờ thanh toán</p>
                    <p className="text-2xl font-bold text-yellow-900">23</p>
                  </div>
                  <span className="text-3xl">⏳</span>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-purple-900">18.5M</p>
                  </div>
                  <span className="text-3xl">💰</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Thống kê tuần này</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lịch hẹn mới:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thanh toán thành công:</span>
                    <span className="font-semibold text-green-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doanh thu:</span>
                    <span className="font-semibold text-purple-600">1.6M VNĐ</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Hoạt động gần đây</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Lịch hẹn #123 đã thanh toán thành công</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📅</span>
                    <span>Lịch hẹn mới được đặt cho ngày mai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">⏳</span>
                    <span>3 lịch hẹn đang chờ thanh toán</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'payments':
        return <AdminPaymentReconciliation />;
        
      case 'consultations':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý lịch hẹn</h2>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
        
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quản lý người dùng</h2>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Segoe_UI]">
      <Header />
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển Admin</h1>
          <p className="text-gray-600">Quản lý hệ thống và theo dõi hoạt động</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboardPage; 