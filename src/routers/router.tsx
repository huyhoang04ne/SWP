import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import CycleTracking from "../pages/CycleTracking/CycleTracking";
import PeriodCalendarPage from "../pages/PeriodCalendar/PeriodCalendarPage";
import CycleSummary from "../pages/CycleTracking/CycleSummary";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthPage from "../pages/Auth/AuthPage";
import MedicationReminderPage from "../pages/MedicationReminderPage";
import Consaultant from "../pages/consaultant/consaultant"; // 👈 nếu bạn đổi tên thành Consultant, nhớ sửa lại
import Pricing from "../pages/Pricing/Pricing"; // 👈 Trang bảng giá

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
      {
        path: "consultant",
        element: (
          <ProtectedRoute>
            <Consaultant />
          </ProtectedRoute>
        ),
      },
      {
        path: "pricing",
        element: <Pricing />,
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
]);

export default routers;
