import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import CycleTracking from "../pages/CycleTracking/CycleTracking";
import PeriodCalendarPage from "../pages/PeriodCalendar/PeriodCalendarPage";
import CycleSummary from "../pages/CycleTracking/CycleSummary";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthPage from "../pages/Auth/AuthPage";
import MedicationReminderPage from "../pages/MedicationReminderPage";

// 🔧 Nếu tên thư mục đúng là `consaultant` thì để nguyên, nếu sai chính tả thì sửa thành:
import Consultant from "../pages/consaultant/consaultant";

import Pricing from "../pages/Pricing/Pricing";

// ✅ Các file Cẩm nang
import LuuYTruoc from "../pages/handbook/LuuYTruoc";
import LuuYSau from "../pages/handbook/LuuYSau";
import CauHoiThuongGap from "../pages/handbook/CauHoiThuongGap";

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
            <Consultant />
          </ProtectedRoute>
        ),
      },
      {
        path: "pricing",
        element: <Pricing />,
      },

      // ✅ Các route cho Cẩm nang
      {
        path: "cam-nang/luu-y-truoc",
        element: <LuuYTruoc />,
      },
      {
        path: "cam-nang/luu-y-sau",
        element: <LuuYSau />,
      },
      {
        path: "cam-nang/faq",
        element: <CauHoiThuongGap />,
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
