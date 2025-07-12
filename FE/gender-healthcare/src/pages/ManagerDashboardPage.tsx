import React from "react";
import AssignShiftForm from "../components/AssignShiftForm";
import AvailableCounselorsList from "../components/AvailableCounselorsList";

const ManagerDashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý phân ca tư vấn viên</h1>
      <AssignShiftForm />
      <hr className="my-6" />
      <AvailableCounselorsList />
    </div>
  );
};

export default ManagerDashboardPage; 