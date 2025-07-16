import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import CycleTracking from "../pages/CycleTracking/CycleTracking";
import PeriodCalendarPage from "../pages/PeriodCalendar/PeriodCalendarPage";
import CycleSummary from "../pages/CycleTracking/CycleSummary";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthPage from "../pages/Auth/AuthPage";
import MedicationReminderPage from '../pages/MedicationReminder/MedicationReminderPage';
import BookingConsultationPage from '../pages/BookingConsultationPage';
import ManagerDashboardPage from "../pages/ManagerDashboardPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import CounselorDashboard from "../pages/CounselorDashboard";
import MySchedule from "../pages/MySchedule";
import PatientConsultations from "../pages/PatientConsultations";
import CounselorConsultations from "../pages/CounselorConsultations";
import PaymentPage from "../pages/PaymentPage";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "cycle-tracking",
        element: (
          <ProtectedRoute>
            <CycleTracking />
          </ProtectedRoute>
        ),
      },
      {
        path: "period-calendar",
        element: (
          <ProtectedRoute>
            <PeriodCalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "cycle-summary",
        element: (
          <ProtectedRoute>
            <CycleSummary />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/medication-reminder",
    element: (
      <ProtectedRoute>
        <MedicationReminderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/booking-consultation',
    element: <BookingConsultationPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/manager',
    element: <ManagerDashboardPage />,
  },
  {
    path: '/counselor',
    element: (
      <ProtectedRoute>
        <CounselorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-schedule',
    element: (
      <ProtectedRoute>
        <MySchedule />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient-consultations',
    element: (
      <ProtectedRoute>
        <PatientConsultations />
      </ProtectedRoute>
    ),
  },
  {
    path: '/counselor-consultations',
    element: (
      <ProtectedRoute>
        <CounselorConsultations />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/:appointmentId',
    element: (
      <ProtectedRoute>
        <PaymentPage />
      </ProtectedRoute>
    ),
  },
]);

export default routers;
