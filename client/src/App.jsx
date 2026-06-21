import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseListPage from "./page/CourseListPage";
import CourseDetailsPage from "./page/CourseDetailsPage";
import SchedulePage from "./page/SchedulePage";
import AccountInfoPage from "./page/AccountInfoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourseListPage />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/account" element={<AccountInfoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;