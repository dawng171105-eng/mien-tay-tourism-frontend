import { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { formatCurrency, formatDate } from '../../constants';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!stats) return null;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Bảng điều khiển</h1>
      <p className="mt-1 text-slate-600">Thống kê tổng quan hệ thống du lịch Miền Tây</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Doanh thu', value: formatCurrency(stats.totalRevenue), color: 'bg-green-50 text-green-700' },
          { label: 'Đơn đặt tour', value: stats.bookingCount, color: 'bg-blue-50 text-blue-700' },
          { label: 'Tour đang hoạt động', value: stats.tourCount, color: 'bg-river-50 text-river-700' },
          { label: 'Khách hàng', value: stats.userCount, color: 'bg-sunset-400/20 text-sunset-600' },
        ].map((item) => (
          <div key={item.label} className={`card ${item.color}`}>
            <p className="text-sm opacity-80">{item.label}</p>
            <p className="mt-1 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">Tour được đặt nhiều nhất</h2>
          <div className="mt-4 space-y-3">
            {stats.popularTours?.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có dữ liệu</p>
            ) : (
              stats.popularTours.map((item, i) => (
                <div key={i} className="flex justify-between border-b pb-2 text-sm">
                  <span>{item.tour?.name} ({item.tour?.province})</span>
                  <span className="font-medium">{item.bookings} đơn · {formatCurrency(item.revenue)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold">Quan tâm theo tỉnh</h2>
          <div className="mt-4 space-y-3">
            {stats.provinceInterest?.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="w-28 text-sm">{p._id}</span>
                <div className="h-3 flex-1 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-river-500"
                    style={{ width: `${Math.min(100, p.tourCount * 20)}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{p.tourCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="font-semibold">Đơn đặt gần đây</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="pb-2">Khách</th>
                <th className="pb-2">Tour</th>
                <th className="pb-2">Ngày đi</th>
                <th className="pb-2">Trạng thái</th>
                <th className="pb-2">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings?.map((b) => (
                <tr key={b._id} className="border-b">
                  <td className="py-2">{b.user?.name}</td>
                  <td className="py-2">{b.tour?.name}</td>
                  <td className="py-2">{formatDate(b.departureDate)}</td>
                  <td className="py-2">{b.status}</td>
                  <td className="py-2">{formatCurrency(b.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
