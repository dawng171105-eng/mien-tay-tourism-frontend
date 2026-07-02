import { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { BOOKING_STATUS, PAYMENT_STATUS, formatCurrency, formatDate } from '../../constants';

export default function AdminHotelBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/hotel-bookings')
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status, paymentStatus) {
    try {
      const res = await api.put(`/hotel-bookings/${id}/status`, { status, paymentStatus });
      setBookings((prev) => prev.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      alert(err.message);
    }
  }

  const filtered = filter ? bookings.filter((b) => b.status === filter) : bookings;
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    revenue: bookings
      .filter((b) => b.paymentStatus === 'paid')
      .reduce((s, b) => s + b.totalPrice, 0),
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-slate-800">Quản lý đặt phòng khách sạn</h2>
      <p className="mt-1 text-sm text-slate-500">Duyệt, cập nhật thanh toán và quản lý đơn đặt phòng</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng đơn', value: stats.total, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Chờ duyệt', value: stats.pending, color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
          { label: 'Đã duyệt', value: stats.approved, color: 'bg-green-50 text-green-700 border-green-100' },
          { label: 'Doanh thu', value: formatCurrency(stats.revenue), color: 'bg-river-50 text-river-700 border-river-100' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
            <p className="mt-1 text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {[
          { val: '', label: 'Tất cả' },
          { val: 'pending', label: 'Chờ duyệt' },
          { val: 'approved', label: 'Đã duyệt' },
          { val: 'cancelled', label: 'Đã hủy' },
          { val: 'completed', label: 'Hoàn thành' },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              filter === f.val
                ? 'bg-river-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-400 self-center">{filtered.length} đơn</span>
      </div>

      {/* Bookings list */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">Không có đơn đặt nào</div>
        ) : (
          filtered.map((b) => {
            const nights = Math.round(
              (new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)
            );
            return (
              <div key={b._id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-4 items-start justify-between">
                  {/* Hotel info */}
                  <div className="flex gap-3">
                    {b.hotel?.images?.[0] && (
                      <img
                        src={b.hotel.images[0]}
                        alt={b.hotel.name}
                        className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-bold text-slate-800">{b.hotel?.name}</p>
                      <p className="text-xs text-slate-400">📍 {b.hotel?.province}</p>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="text-sm text-slate-600 space-y-0.5">
                    <p>👤 <strong>{b.user?.name}</strong> — {b.user?.email}</p>
                    <p>📞 {b.user?.phone || '—'}</p>
                    <p>🛏️ {formatDate(b.checkIn)} → {formatDate(b.checkOut)} ({nights} đêm)</p>
                    <p>👥 {b.guests} khách · {b.notes && <span className="italic">"{b.notes}"</span>}</p>
                  </div>

                  {/* Price & Status */}
                  <div className="text-right space-y-2">
                    <p className="text-lg font-bold text-river-700">{formatCurrency(b.totalPrice)}</p>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BOOKING_STATUS[b.status]?.color}`}>
                        {BOOKING_STATUS[b.status]?.label}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_STATUS[b.paymentStatus]?.color}`}>
                        {PAYMENT_STATUS[b.paymentStatus]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{formatDate(b.createdAt)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-slate-50 flex flex-wrap gap-2">
                  {b.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(b._id, 'approved', b.paymentStatus)}
                      className="rounded-lg bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 text-xs font-semibold hover:bg-green-100 transition"
                    >
                      ✅ Duyệt đơn
                    </button>
                  )}
                  {b.status === 'approved' && (
                    <button
                      onClick={() => updateStatus(b._id, 'completed', b.paymentStatus)}
                      className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 text-xs font-semibold hover:bg-blue-100 transition"
                    >
                      🏁 Hoàn thành
                    </button>
                  )}
                  {(b.status === 'pending' || b.status === 'approved') && (
                    <button
                      onClick={() => updateStatus(b._id, 'cancelled', b.paymentStatus)}
                      className="rounded-lg bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition"
                    >
                      ✕ Hủy đơn
                    </button>
                  )}
                  {b.paymentStatus === 'unpaid' && b.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(b._id, b.status, 'paid')}
                      className="rounded-lg bg-river-50 text-river-700 border border-river-200 px-3 py-1.5 text-xs font-semibold hover:bg-river-100 transition"
                    >
                      💳 Xác nhận thanh toán
                    </button>
                  )}
                  {b.paymentStatus === 'paid' && b.status === 'cancelled' && (
                    <button
                      onClick={() => updateStatus(b._id, b.status, 'refunded')}
                      className="rounded-lg bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 transition"
                    >
                      ↩️ Hoàn tiền
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
