import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { GalleryPage } from "./pages/GalleryPage";
import { HistoryPage } from "./pages/HistoryPage";
import { Home } from "./pages/Home";
import { ProcessingPage } from "./pages/ProcessingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ResultPage } from "./pages/ResultPage";
import { UploadPage } from "./pages/UploadPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/result/:fontId" element={<ResultPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
