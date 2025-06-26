import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "../pages/Home/HomeScreen";
import LoginPage from "../pages/Login/Login";
import RegisterPage from "../pages/Register/Register";  
import CycleTracking from "../pages/CycleTracking/CycleTracking";
import PeriodCalendarPage from "../pages/PeriodCalendar/PeriodCalendarPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/cycle-tracking",
    element: (
      <ProtectedRoute>
        <CycleTracking />
      </ProtectedRoute>
    ),
  },
  {
    path: "/period-calendar",
    element: (
      <ProtectedRoute>
        <PeriodCalendarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  }
]);

export default routers;