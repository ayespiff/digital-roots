import { Outlet, NavLink, Link } from "react-router-dom";

export default function Shell() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? "text-black font-medium" : "text-slate-600 hover:text-slate-900"}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Digital Roots</Link>
          <nav className="flex gap-4">
            <NavLink to="/learn" className={link}>Learn</NavLink>
            <NavLink to="/progress" className={link}>Progress</NavLink>
            <NavLink to="/admin" className={link}>Admin</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 py-3">© {new Date().getFullYear()} Digital Roots</div>
      </footer>
    </div>
  );
}
