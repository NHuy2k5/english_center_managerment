import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import DashboardPage from "./page/DashboardPage";
import StudentPage from "./page/StudentPage";
import PaymentPage from "./page/PaymentPage";
import TeacherPage from "./page/TeacherPage";
import PayrollPage from "./page/PayrollPage";
import SchedulePage from "./page/SchedulePage";
import AccountInfoPage from "./page/AccountInfoPage";
import ClassPage from "./page/ClassPage";
import ClassListPage from "./page/ClassListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/class" element={<ClassPage />} />
        <Route path="/class/:categoryId" element={<ClassListPage />} />
        
        {/* Preview Routes */}
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/account-info" element={<AccountInfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;