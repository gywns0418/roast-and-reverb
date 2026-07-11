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
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/join" element={<Navigate to="/auth/join" replace />} />
      <Route path="/signup" element={<Navigate to="/auth/join" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/join" element={<JoinPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/today" element={<Navigate to="/coffee/write" replace />} />
        <Route path="/logs/today" element={<Navigate to="/coffee/write" replace />} />

        <Route path="/coffee" element={<CoffeeLogPage />} />
        <Route path="/coffee-logs" element={<CoffeeLogPage />} />
        <Route path="/logs/coffee" element={<CoffeeLogPage />} />
        <Route path="/coffee/write" element={<CoffeeWritePage />} />
        <Route path="/coffee/new" element={<Navigate to="/coffee/write" replace />} />
        <Route path="/coffee-logs/new" element={<Navigate to="/coffee/write" replace />} />
        <Route path="/coffee-logs/:id" element={<CoffeeDetailPage />} />
        <Route path="/coffee-logs/:id/edit" element={<CoffeeEditPage />} />
        <Route path="/coffee/:id" element={<CoffeeDetailPage />} />
        <Route path="/coffee/:id/edit" element={<CoffeeEditPage />} />

        <Route path="/music" element={<MusicLogPage />} />
        <Route path="/music-logs" element={<MusicLogPage />} />
        <Route path="/logs/music" element={<MusicLogPage />} />
        <Route path="/music/search" element={<MusicSearchPage />} />
        <Route path="/music/write" element={<MusicWritePage />} />
        <Route path="/music/new" element={<Navigate to="/music/write" replace />} />
        <Route path="/music-logs/new" element={<Navigate to="/music/write" replace />} />
        <Route path="/music-logs/:id" element={<MusicDetailPage />} />
        <Route path="/music/:id" element={<MusicDetailPage />} />

        <Route path="/pairing" element={<PairingPage />} />
        <Route path="/pairings" element={<PairingPage />} />
        <Route path="/ai-pairing" element={<Navigate to="/pairing" replace />} />
        <Route path="/pairing/write" element={<PairingWritePage />} />
        <Route path="/pairing/new" element={<Navigate to="/pairing/write" replace />} />
        <Route path="/pairings/new" element={<Navigate to="/pairing/write" replace />} />
        <Route path="/pairings/:id" element={<PairingDetailPage />} />
        <Route path="/pairing/:id" element={<PairingDetailPage />} />

        <Route path="/report" element={<Navigate to="/report/monthly" replace />} />
        <Route path="/report/monthly" element={<MonthlyReportPage />} />
        <Route path="/reports" element={<Navigate to="/report/monthly" replace />} />
        <Route path="/reports/monthly" element={<MonthlyReportPage />} />
        <Route path="/monthly-report" element={<Navigate to="/report/monthly" replace />} />

        <Route path="/recommend" element={<RecommendPage />} />
        <Route path="/recommendations" element={<RecommendPage />} />

        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/crate" element={<CollectionPage />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/me" element={<MyPage />} />
        <Route path="/profile" element={<MyPage />} />

        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/members" element={<AdminMemberPage />} />
        <Route path="/admin/member" element={<Navigate to="/admin/members" replace />} />
        <Route path="/admin/ai-logs" element={<AdminAiLogPage />} />
        <Route path="/admin/api-logs" element={<AdminAiLogPage />} />
        <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
        <Route path="/admin/stats" element={<Navigate to="/admin/statistics" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
