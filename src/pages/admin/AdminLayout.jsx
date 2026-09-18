import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/articles', label: 'Bài viết' },
  { to: '/admin/tours', label: 'Tour' },
  { to: '/admin/bookings', label: 'Đơn đặt' },
  { to: '/admin/revenue', label: 'Doanh thu' },
];

export default function AdminLayout() {
  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
      <aside className="w-56 shrink-0">
        <h2 className="font-heading text-xl font-bold text-river-800">Quản trị</h2>
        <nav className="mt-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-river-600 text-white' : 'text-slate-600 hover:bg-river-50'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
