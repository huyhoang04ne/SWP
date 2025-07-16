import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelConsultation } from '../api/consultationApi';
import { ConsultationSchedule, ConsultationStatus } from '../types/consultation';
import type { ConsultationFilter as ConsultationFilterType } from '../types/consultation';
import ConsultationList from '../components/ConsultationList';
import ConsultationFilterComponent from '../components/ConsultationFilter';
import Header from '../components/header';
import Footer from '../components/Footer';
import Navbar from '../components/navbar';

const PatientConsultations: React.FC = () => {
  const [consultations, setConsultations] = useState<ConsultationSchedule[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      setConsultations(response.data);
      setFilteredConsultations(response.data);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Không thể tải danh sách lịch tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: ConsultationFilterType) => {
    let filtered = [...consultations];

    if (filter.fromDate) {
      filtered = filtered.filter(c => 
        new Date(c.scheduledDate).toISOString().split('T')[0] >= filter.fromDate!
      );
    }

    if (filter.toDate) {
      filtered = filtered.filter(c => 
        new Date(c.scheduledDate).toISOString().split('T')[0] <= filter.toDate!
      );
    }

    if (filter.status) {
      filtered = filtered.filter(c => c.status === filter.status);
    }

    setFilteredConsultations(filtered);
  };

  const handleCancel = async (id: number, reason?: string) => {
    try {
      await cancelConsultation(id, reason || 'Bệnh nhân hủy lịch');
      setMessage('Hủy lịch thành công');
      fetchConsultations(); // Refresh danh sách
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Không thể hủy lịch');
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch tư vấn của tôi</h1>
          <p className="text-gray-600">Xem và quản lý các lịch tư vấn của bạn</p>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            {message}
          </div>
        )}

        <ConsultationFilterComponent onFilterChange={handleFilterChange} />

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách lịch tư vấn ({filteredConsultations.length})
          </h2>
          <button
            onClick={fetchConsultations}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Làm mới
          </button>
        </div>

        <ConsultationList
          consultations={filteredConsultations}
          userRole="Patient"
          onCancel={handleCancel}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PatientConsultations; 