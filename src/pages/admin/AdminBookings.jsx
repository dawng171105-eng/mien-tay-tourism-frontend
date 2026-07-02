import { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { BOOKING_STATUS, PAYMENT_STATUS, formatCurrency, formatDate } from '../../constants';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/bookings')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id, data) {
    await api.put(`/bookings/${id}/status`, data);
    load();
  }

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold">Quản lý đơn đặt tour</h1>
      <p className="mt-1 text-slate-600">Duyệt, hủy và cập nhật trạng thái thanh toán</p>

      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <p className="text-slate-500">Chưa có đơn đặt nào</p>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="card">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{b.tour?.name}</h3>
                  <p className="text-sm text-slate-600">
                    Khách: {b.user?.name} ({b.user?.email}) · {b.user?.phone}
                  </p>
                  <p className="mt-1 text-sm">
                    Khởi hành: {formatDate(b.departureDate)} · {b.passengers} khách · {formatCurrency(b.totalPrice)}
                  </p>
                  {b.notes && <p className="text-sm text-slate-500">Ghi chú: {b.notes}</p>}
                  <div className="mt-2 flex gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${BOOKING_STATUS[b.status]?.color}`}>
                      {BOOKING_STATUS[b.status]?.label}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs ${PAYMENT_STATUS[b.paymentStatus]?.color}`}>
                      {PAYMENT_STATUS[b.paymentStatus]?.label}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {b.status === 'pending' && (
                    <>
                      <button className="btn-primary text-sm" onClick={() => updateStatus(b._id, { status: 'approved' })}>
                        Duyệt đơn
                      </button>
                      <button className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700" onClick={() => updateStatus(b._id, { status: 'cancelled' })}>
                        Hủy đơn
                      </button>
                    </>
                  )}
                  {b.status === 'approved' && (
                    <button className="btn-secondary text-sm" onClick={() => updateStatus(b._id, { status: 'completed' })}>
                      Hoàn thành
                    </button>
                  )}
                  {b.paymentStatus === 'unpaid' && b.status !== 'cancelled' && (
                    <button className="btn-secondary text-sm" onClick={() => updateStatus(b._id, { paymentStatus: 'paid' })}>
                      Đánh dấu đã thanh toán
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
