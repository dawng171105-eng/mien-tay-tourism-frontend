import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  const linkClass = ({ isActive }) =>
    `transition hover:text-river-600 ${
      isActive ? "text-river-700 font-medium" : "text-slate-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-river-50 text-river-700 font-medium"
        : "text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading text-2xl font-bold text-river-800"
        >
          <span aria-hidden="true">🌾</span>
          <span>Du Lịch Miền Tây</span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink to="/" className={linkClass} end>
            Trang chủ
          </NavLink>
          <NavLink to="/tours" className={linkClass}>
            Tour du lịch
          </NavLink>
          <NavLink to="/ai-planner" className={linkClass}>
            ✨ Trợ lý AI
          </NavLink>
          <NavLink to="/guide" className={linkClass}>
            Cẩm nang
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            Về chúng tôi
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Liên hệ
          </NavLink>
          {user?.role === "customer" && (
            <NavLink to="/bookings" className={linkClass}>
              Đơn đặt tour
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              Quản trị
            </NavLink>
          )}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-global-search"))
              }
              className="p-2 text-slate-600 hover:text-river-600 transition"
              aria-label="Tìm kiếm"
              title="Tìm kiếm (Ctrl+K)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href,
                  )}`,
                  "facebook-share-dialog",
                  "width=600,height=400",
                );
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/intent/tweet?url="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-blue-400"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.href,
                  )}&text=${encodeURIComponent(document.title)}`,
                  "twitter-share-dialog",
                  "width=600,height=300",
                );
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477 4.072 4.072 0 01-1.86-.513 4.107 4.107 0 003.1 1.593 4.222 4.222 0 01-1.784.07 4.108 4.108 0 003.832 2.85 8.36 8.36 0 01-5.1 1.757 8.336 8.336 0 01-1.28-.093 11.647 11.647 0 006.29 1.833" />
              </svg>
            </a>
            <a
              href="https://zalo.me/share?text="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-blue-500"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `https://zalo.me/share?text=${encodeURIComponent(
                    document.title + " - " + window.location.href,
                  )}`,
                  "zalo-share-dialog",
                  "width=600,height=300",
                );
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.5-5.5h3v1.5h-3v-1.5zm0-1.5h3v1.5h-3v-1.5zm0-1.5h3v1.5h-3v-1.5zm0-1.5h3v1.5h-3v-1.5zm0-1.5h3v1.5h-3v-1.5zm0-1.5h3v1.5h-3v-1.5z" />
              </svg>
            </a>
          </div>
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/profile"}
                className="text-sm text-slate-600 hover:text-river-700"
              >
                Xin chào, {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Đăng ký
              </Link>
            </>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-river-700"
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t bg-white shadow-lg animate-fade-in">
          <nav className="flex flex-col py-2">
            <NavLink
              to="/"
              className={mobileLinkClass}
              end
              onClick={() => setMenuOpen(false)}
            >
              🏠 Trang chủ
            </NavLink>
            <NavLink
              to="/tours"
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              🛶 Tour du lịch
            </NavLink>
            <NavLink
              to="/ai-planner"
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              ✨ Trợ lý AI
            </NavLink>
            <NavLink
              to="/guide"
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              📖 Cẩm nang
            </NavLink>
            <NavLink
              to="/about"
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              ℹ️ Về chúng tôi
            </NavLink>
            <NavLink
              to="/contact"
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              📞 Liên hệ
            </NavLink>
            {user?.role === "customer" && (
              <NavLink
                to="/bookings"
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                📋 Đơn đặt tour
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={mobileLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                ⚙️ Quản trị
              </NavLink>
            )}
            <hr className="my-2 border-slate-100" />
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-global-search"));
                setMenuOpen(false);
              }}
              className="mx-4 my-1 py-2 flex items-center gap-2 text-slate-600 hover:text-river-600 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              🔍 Tìm kiếm
            </button>
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-slate-500">
                  Xin chào, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="mx-4 my-2 btn-secondary text-sm text-center"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 py-2">
                <Link
                  to="/login"
                  className="btn-secondary text-sm flex-1 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm flex-1 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
