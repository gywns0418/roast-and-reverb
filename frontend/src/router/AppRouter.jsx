import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import JoinPage from "../pages/auth/JoinPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import CoffeeLogPage from "../pages/coffee/CoffeeLogPage.jsx";
import CoffeeWritePage from "../pages/coffee/CoffeeWritePage.jsx";
import CoffeeDetailPage from "../pages/coffee/CoffeeDetailPage.jsx";
import CoffeeEditPage from "../pages/coffee/CoffeeEditPage.jsx";
import MusicLogPage from "../pages/music/MusicLogPage.jsx";
import MusicSearchPage from "../pages/music/MusicSearchPage.jsx";
import MusicWritePage from "../pages/music/MusicWritePage.jsx";
import MusicDetailPage from "../pages/music/MusicDetailPage.jsx";
import PairingPage from "../pages/pairing/PairingPage.jsx";
import PairingWritePage from "../pages/pairing/PairingWritePage.jsx";
import PairingDetailPage from "../pages/pairing/PairingDetailPage.jsx";
import MonthlyReportPage from "../pages/report/MonthlyReportPage.jsx";
import RecommendPage from "../pages/recommend/RecommendPage.jsx";
import CollectionPage from "../pages/collection/CollectionPage.jsx";
import MyPage from "../pages/mypage/MyPage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminMemberPage from "../pages/admin/AdminMemberPage.jsx";
import AdminAiLogPage from "../pages/admin/AdminAiLogPage.jsx";
import AdminStatisticsPage from "../pages/admin/AdminStatisticsPage.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/join" element={<JoinPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/coffee" element={<CoffeeLogPage />} />
        <Route path="/coffee/write" element={<CoffeeWritePage />} />
        <Route path="/coffee/:id" element={<CoffeeDetailPage />} />
        <Route path="/coffee/:id/edit" element={<CoffeeEditPage />} />
        <Route path="/music" element={<MusicLogPage />} />
        <Route path="/music/search" element={<MusicSearchPage />} />
        <Route path="/music/write" element={<MusicWritePage />} />
        <Route path="/music/:id" element={<MusicDetailPage />} />
        <Route path="/pairing" element={<PairingPage />} />
        <Route path="/pairing/write" element={<PairingWritePage />} />
        <Route path="/pairing/:id" element={<PairingDetailPage />} />
        <Route path="/report/monthly" element={<MonthlyReportPage />} />
        <Route path="/recommend" element={<RecommendPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/members" element={<AdminMemberPage />} />
        <Route path="/admin/ai-logs" element={<AdminAiLogPage />} />
        <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
      </Route>
    </Routes>
  );
}
