import { useEffect, useState } from 'react';
import api from '../api/api';
import Loading from '../components/Loading';
import { BOOKING_STATUS, PAYMENT_STATUS, formatCurrency, formatDate } from '../constants';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/bookings/my')
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold">Đơn đặt tour của tôi</h1>
      <p className="mt-2 text-slate-600">Theo dõi trạng thái đơn hàng và lịch trình tour</p>

      {bookings.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">Bạn chưa có đơn đặt tour nào</p>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{b.tour?.name}</h3>
                  <p className="text-sm text-slate-600">{b.tour?.province} · {b.tour?.duration}</p>
                  <p className="mt-2 text-sm">Khởi hành: <strong>{formatDate(b.departureDate)}</strong></p>
                  <p className="text-sm">Số khách: <strong>{b.passengers}</strong></p>
                  {b.notes && <p className="mt-1 text-sm text-slate-500">Ghi chú: {b.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-river-700">{formatCurrency(b.totalPrice)}</p>
                  <div className="mt-2 flex flex-wrap justify-end gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${BOOKING_STATUS[b.status]?.color}`}>
                      {BOOKING_STATUS[b.status]?.label}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs ${PAYMENT_STATUS[b.paymentStatus]?.color}`}>
                      {PAYMENT_STATUS[b.paymentStatus]?.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Đặt ngày {formatDate(b.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
