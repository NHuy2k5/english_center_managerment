import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseListPage from "./page/CourseListPage";
import CourseDetailsPage from "./page/CourseDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourseListPage />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;