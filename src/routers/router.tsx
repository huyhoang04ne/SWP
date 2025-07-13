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
import Stis from "../pages/stis/stis";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "cycle-tracking",
        element: <CycleTracking />
     
      },
      {
        path: "period-calendar",
        element: <PeriodCalendarPage />
        
      },
      {
        path: "cycle-summary",
        element: <CycleSummary />
        
      },
      {
        path: "consultant",
       element: <Consultant/>,
      },
       {
        path: "stis",
       element: <Stis/>,
      },

      {
        path: "bang-gia",
        element: <Pricing/>,
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
        path: "gioi-thieu/he-thong",
        element: <GenderCare />,
      },
      {
        path: "gioi-thieu/doi-ngu",
        element: <OurMedicalTeam />,
      },
        {
        path: "gioi-thieu/tuyen-dung",
        element: <Recruitment/>,
      },
      // router cho Pathology
      {
        path: "benh-hoc",
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
    element:  <MedicationReminderPage />
   
  },
]);

export default routers;
