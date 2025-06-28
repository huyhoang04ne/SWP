import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import ModernLogin from "../pages/Login/ModernLogin";
import RegisterPage from "../pages/Register/Register";
import CycleTracking from "../pages/CycleTracking/CycleTracking";
import PeriodCalendarPage from "../pages/PeriodCalendar/PeriodCalendarPage";
import CycleSummary from "../pages/CycleTracking/CycleSummary";
import ProtectedRoute from "../components/ProtectedRoute";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // dùng HomePage làm layout luôn
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
    path: "/login",
    element: <ModernLogin />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default routers;
