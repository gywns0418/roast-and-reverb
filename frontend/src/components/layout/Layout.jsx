import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
