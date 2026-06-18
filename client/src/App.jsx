import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseListPage from "./page/CourseListPage";
import CourseDetailsPage from "./page/CourseDetailsPage";
import SchedulePage from "./page/SchedulePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourseListPage />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;