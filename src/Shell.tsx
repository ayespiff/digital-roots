import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { logout } from "./services/authAPI";
import { useNavigate } from "react-router-dom";

type User = { id: number; name: string } | null;

type ShellProps = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export default function Shell({ user, setUser }: ShellProps) {
  const navigate = useNavigate();

  const link = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? "text-black font-medium" : "text-slate-600 hover:text-slate-900"}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Digital Roots</Link>
          <nav className="flex items-center gap-4">

            {/*Only show these if logged in */}
            {user && (
              <>
                <NavLink to="/explore" className={link}>Explore</NavLink>
                <NavLink to="/learn" className={link}>Learn</NavLink>
                <NavLink to="/progress" className={link}>Progress</NavLink>
                <NavLink to="/admin" className={link}>Admin</NavLink>
              </>
            )}

            {user ? (
              <>
                <span className="text-sm text-slate-600">
                  {user.name}
                </span>
                <button
                  onClick={async () => {
                    await logout();
                    setUser(null);
                    navigate("/", { replace: true });
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={link}>Login</NavLink>
                <NavLink to="/register" className={link}>Register</NavLink>
              </>
            )}

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
