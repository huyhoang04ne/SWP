import React from 'react';
import Header from '../../components/header';
import Navbar from '../../components/navbar';
import MedicationReminderForm from '../../components/MedicationReminderForm';

const MedicationReminderPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
    <Header />
    <Navbar />
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg mt-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center">Đăng ký nhắc uống thuốc</h1>
        <p className="text-gray-500 text-center mb-6">Hệ thống sẽ tự động gửi email nhắc nhở bạn uống thuốc đúng giờ mỗi ngày.</p>
        <MedicationReminderForm />
      </div>
    </div>
  </div>
);

export default MedicationReminderPage; 