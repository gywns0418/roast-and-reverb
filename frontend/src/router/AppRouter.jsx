import {lazy,Suspense} from 'react';
const JourneyPage=lazy(()=>import('../pages/ritual/JourneyPage.jsx'));
const HelpPage=lazy(()=>import('../pages/mypage/HelpPage.jsx'));
const RitualPage=lazy(()=>import('../pages/ritual/RitualPage.jsx'));
const SoundStudioPage=lazy(()=>import('../pages/ritual/SoundStudioPage.jsx'));
const BackupPage=lazy(()=>import('../pages/mypage/BackupPage.jsx'));
const ConnectionsPage=lazy(()=>import('../pages/mypage/ConnectionsPage.jsx'));
const MemoriesPage=lazy(()=>import('../pages/ritual/MemoriesPage.jsx'));
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
const BeansPage=lazy(()=>import('../pages/beans/BeansPage.jsx'));
const HomePage=lazy(()=>import('../pages/HomePage.jsx'));
const LoginPage=lazy(()=>import('../pages/auth/LoginPage.jsx'));
const JoinPage=lazy(()=>import('../pages/auth/JoinPage.jsx'));
const FindIdPage=lazy(()=>import('../pages/auth/FindIdPage.jsx'));
const FindPasswordPage=lazy(()=>import('../pages/auth/FindPasswordPage.jsx'));
const DashboardPage=lazy(()=>import('../pages/dashboard/DashboardPage.jsx'));
const CoffeeLogPage=lazy(()=>import('../pages/coffee/CoffeeLogPage.jsx'));
const CoffeeImportPage=lazy(()=>import('../pages/coffee/CoffeeImportPage.jsx'));
const CoffeeWritePage=lazy(()=>import('../pages/coffee/CoffeeWritePage.jsx'));
const CoffeeDetailPage=lazy(()=>import('../pages/coffee/CoffeeDetailPage.jsx'));
const CoffeeEditPage=lazy(()=>import('../pages/coffee/CoffeeEditPage.jsx'));
const MusicLogPage=lazy(()=>import('../pages/music/MusicLogPage.jsx'));
const MusicSearchPage=lazy(()=>import('../pages/music/MusicSearchPage.jsx'));
const MusicWritePage=lazy(()=>import('../pages/music/MusicWritePage.jsx'));
const MusicDetailPage=lazy(()=>import('../pages/music/MusicDetailPage.jsx'));
const PairingPage=lazy(()=>import('../pages/pairing/PairingPage.jsx'));
const PairingWritePage=lazy(()=>import('../pages/pairing/PairingWritePage.jsx'));
const PairingDetailPage=lazy(()=>import('../pages/pairing/PairingDetailPage.jsx'));
const MonthlyReportPage=lazy(()=>import('../pages/report/MonthlyReportPage.jsx'));
const RecommendPage=lazy(()=>import('../pages/recommend/RecommendPage.jsx'));
const MonthlyPickPage=lazy(()=>import('../pages/monthlypick/MonthlyPickPage.jsx'));
const CollectionPage=lazy(()=>import('../pages/collection/CollectionPage.jsx'));
const CollectionWritePage=lazy(()=>import('../pages/collection/CollectionWritePage.jsx'));
const MyPage=lazy(()=>import('../pages/mypage/MyPage.jsx'));
const AdminDashboardPage=lazy(()=>import('../pages/admin/AdminDashboardPage.jsx'));
const AdminMemberPage=lazy(()=>import('../pages/admin/AdminMemberPage.jsx'));
const AdminAiLogPage=lazy(()=>import('../pages/admin/AdminAiLogPage.jsx'));
const AdminStatisticsPage=lazy(()=>import('../pages/admin/AdminStatisticsPage.jsx'));

export default function AppRouter() {
  return (
    <Suspense fallback={<main className="page" role="status" style={{padding:40}}>페이지를 준비하고 있어요…</main>}><Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/join" element={<Navigate to="/auth/join" replace />} />
      <Route path="/signup" element={<Navigate to="/auth/join" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/join" element={<JoinPage />} />
      <Route path="/auth/find-id" element={<FindIdPage />} />
      <Route path="/auth/find-password" element={<FindPasswordPage />} />
      <Route element={<Layout />}>
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/start" element={<Navigate to="/journey" replace />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/ritual" element={<RitualPage />} />
        <Route path="/studio" element={<SoundStudioPage />} />
        <Route path="/backup" element={<BackupPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/memories" element={<MemoriesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/today" element={<Navigate to="/coffee/write" replace />} />
        <Route path="/logs/today" element={<Navigate to="/coffee/write" replace />} />

        <Route path="/beans" element={<BeansPage />} />
        <Route path="/coffee" element={<CoffeeLogPage />} />
        <Route path="/coffee-logs" element={<CoffeeLogPage />} />
        <Route path="/logs/coffee" element={<CoffeeLogPage />} />
        <Route path="/coffee/import" element={<CoffeeImportPage />} />
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
        <Route path="/monthly-pick" element={<MonthlyPickPage />} />

        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/crate" element={<CollectionPage />} />
        <Route path="/collection/write" element={<CollectionWritePage />} />
        <Route path="/collection/new" element={<Navigate to="/collection/write" replace />} />

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
    </Routes></Suspense>
  );
}
