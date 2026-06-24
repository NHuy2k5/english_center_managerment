import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseListPage from "./page/CourseListPage";
import CourseDetailsPage from "./page/CourseDetailsPage";
import SchedulePage from "./page/SchedulePage";
import AccountInfoPage from "./page/AccountInfoPage";
import LoginPage from "./page/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/:courseID" element={<CourseDetailsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/account" element={<AccountInfoPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;