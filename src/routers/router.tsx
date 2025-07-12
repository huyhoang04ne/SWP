import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import CycleTracking from "../pages/CycleTracking/CycleTracking";
import PeriodCalendarPage from "../pages/PeriodCalendar/PeriodCalendarPage";
import CycleSummary from "../pages/CycleTracking/CycleSummary";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthPage from "../pages/Auth/AuthPage";
import MedicationReminderPage from "../pages/MedicationReminderPage";
import Consultant from "../pages/consaultant/consaultant";
import Pricing from "../pages/Pricing/Pricing";
import LuuYTruoc from "../pages/handbook/LuuYTruoc";
import LuuYSau from "../pages/handbook/LuuYSau";
import GenderCare from "../pages/AboutUs/GenderCare";
import OurMedicalTeam from "../pages/AboutUs/OurMedicalTeam";
import Recruitment from "../pages/AboutUs/Recruitment";
import Pathology from "../pages/Pathology/Pathology";
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
       element: <Consultant/>,
          
      
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
       // ✅ Các route cho about us
      {
        path: "gioi-thieu/he-thong-gendercare",
        element: <GenderCare />,
      },
      {
        path: "gioi-thieu/doi-ngu-chuyen-gia",
        element: <OurMedicalTeam />,
      },
        {
        path: "gioi-thieu/tuyen-dung",
        element: <Recruitment/>,
      },
      // router cho Pathology
      {
        path: "Pathology",
        element: <Pathology />,
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
