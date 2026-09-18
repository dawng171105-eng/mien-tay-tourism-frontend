import { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { formatCurrency, BOOKING_STATUS, PAYMENT_STATUS } from '../../constants';

const STATUS_LABELS = Object.fromEntries(
  Object.entries(BOOKING_STATUS).map(([k, v]) => [k, v.label]),
);
const TYPE_COLORS = { tour: 'bg-river-500', hotel: 'bg-sunset-500' };

function shortVnd(amount) {
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2).replace('.', ',').replace(/0+$/, '').replace(/,$/, '')} tỷ`;
  return `${Math.round(amount / 1e6)}tr`;
}

export default function Revenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState('all');

  useEffect(() => {
    api
      .get('/admin/revenue')
      .then((res) => setData(res.data))
      .catch(() => setError('Không thể tải dữ liệu doanh thu'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const s = data.summaries;
  const maxMonthly = Math.max(...data.monthly.map((m) => m.revenue + m.hotelRevenue), 1);
  const statusTotal = data.statusBreakdown.reduce((a, b) => a + b.count, 0) || 1;
  const payTotal = data.paymentBreakdown.reduce((a, b) => a + b.count, 0) || 1;

  const kpis = [
    { label: 'Tổng doanh thu', value: formatCurrency(s.totalRevenue), sub: 'Tour + Khách sạn', dot: 'bg-river-500' },
    { label: 'Doanh thu tour', value: formatCurrency(s.tour.revenue), sub: `${s.tour.orders} đơn`, dot: 'bg-river-500' },
    { label: 'Doanh thu khách sạn', value: formatCurrency(s.hotel.revenue), sub: `${s.hotel.orders} đơn`, dot: 'bg-sunset-500' },
    { label: 'Đã thu tiền', value: formatCurrency(s.totalCollected), sub: `${s.collectionRate}% tỷ lệ thu`, dot: 'bg-emerald-500' },
    { label: 'Giá trị đơn TB', value: formatCurrency(s.avgOrderValue), sub: `${s.totalOrders} đơn hợp lệ`, dot: 'bg-sky-500' },
  ];

  const breakdown = data.paymentBreakdown.map((p) => ({
    ...p,
    color: PAYMENT_STATUS[p._id]?.color || 'bg-slate-100 text-slate-800',
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold">Báo cáo doanh thu</h1>
          <p className="mt-1 text-sm text-slate-600">
            12 tháng gần nhất · tính doanh thu từ đơn <span className="font-medium text-green-700">Đã duyệt & Hoàn thành</span>
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <div>
            <p className="text-xs text-slate-500">Tăng trưởng so với kỳ trước</p>
            <p className={`text-lg font-bold ${s.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {s.growth >= 0 ? '+' : ''}{s.growth}%
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <p className="text-xs text-slate-500">Cập nhật</p>
            <p className="font-medium">{new Date(data.generatedAt).toLocaleTimeString('vi-VN')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="card relative overflow-hidden">
            <span className={`absolute left-0 top-0 h-full w-1 ${k.dot}`} />
            <p className="text-sm text-slate-500">{k.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{k.value}</p>
            <p className="mt-1 text-xs text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Doanh thu theo tháng</h2>
            <p className="text-sm text-slate-500">Cột đậm: doanh thu · cột nhạt: đã thu</p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-river-500" /> Tour</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-sunset-500" /> Khách sạn</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-400/70" /> Đã thu</span>
          </div>
        </div>
        <div className="mt-5 flex overflow-x-auto pb-2">
          {data.monthly.map((m) => (
            <div key={m.key} className="flex min-w-[52px] flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-slate-500">{shortVnd(m.revenue + m.hotelRevenue)}</span>
              <div className="flex items-end gap-1" style={{ height: 150 }}>
                <div className={TYPE_COLORS.tour} style={{ width: 11, height: m.revenue > 0 ? Math.max(6, (m.revenue / maxMonthly) * 140) : 2 }} title={`Tour: ${formatCurrency(m.revenue)}`} />
                <div className={TYPE_COLORS.hotel} style={{ width: 11, height: m.hotelRevenue > 0 ? Math.max(6, (m.hotelRevenue / maxMonthly) * 140) : 2 }} title={`Khách sạn: ${formatCurrency(m.hotelRevenue)}`} />
                <div className="bg-emerald-400/70" style={{ width: 5, height: m.collected > 0 ? Math.max(4, (m.collected / maxMonthly) * 140) : 2 }} title={`Đã thu: ${formatCurrency(m.collected)}`} />
              </div>
              <span className="text-[10px] text-slate-500">{m.label.replace('tháng ', 'T').split(',')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">Top tour theo doanh thu</h2>
          <p className="text-xs text-slate-500">Tour / Khách sạn</p>
          <div className="mt-3 flex gap-2">
            {['all', 'tour', 'hotel'].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-full px-3 py-1 text-xs transition ${type === t ? 'bg-river-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {t === 'all' ? 'Tất cả' : t === 'tour' ? 'Tour' : 'Khách sạn'}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {(type === 'tour' ? data.topTours : type === 'hotel' ? data.topHotels : [...data.topTours, ...data.topHotels].slice(0, 8)).map((item, i) => {
              const isHotel = item.hotel;
              const name = isHotel ? item.hotel?.name : item.tour?.name;
              const province = isHotel ? item.hotel?.province : item.tour?.province;
              const revenue = item.revenue;
              const max = Math.max(...(type === 'tour' ? data.topTours : type === 'hotel' ? data.topHotels : [...data.topTours, ...data.topHotels].slice(0, 8)).map((it) => it.revenue), 1);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${isHotel ? TYPE_COLORS.hotel : TYPE_COLORS.tour}`} />
                      <span className="truncate font-medium">{name}</span>
                      <span className="shrink-0 text-xs text-slate-400">{province}</span>
                    </span>
                    <span className="ml-3 shrink-0 font-medium">{formatCurrency(revenue)}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-river-500" style={{ width: `${(revenue / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="font-semibold">Doanh thu theo tỉnh</h2>
            <div className="mt-4 space-y-2.5">
              {data.byProvince.map((p, i) => {
                const max = Math.max(...data.byProvince.map((x) => x.revenue), 1);
                return (
                  <div key={p._id} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-sm">{p._id}</span>
                    <div className="h-3 flex-1 rounded-full bg-slate-100">
                      <div className="h-3 rounded-full bg-sunset-500/80" style={{ width: `${(p.revenue / max) * 100}%` }} />
                    </div>
                    <span className="w-24 shrink-0 text-right text-xs text-slate-500">{formatCurrency(p.revenue)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card">
              <h2 className="font-semibold">Trạng thái đơn</h2>
              <div className="mt-4 space-y-2">
                {data.statusBreakdown.map((x) => (
                  <div key={x._id} className="flex items-center justify-between text-sm">
                    <span>{STATUS_LABELS[x._id] || x._id}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{x.count}</span>
                      <span className="w-12 text-right text-xs text-slate-400">{Math.round((x.count / statusTotal) * 100)}%</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full">
                {data.statusBreakdown.map((x) => (
                  <div
                    key={x._id}
                    className={BOOKING_STATUS[x._id]?.color ? BOOKING_STATUS[x._id].color.match(/bg-[\w-]+/)[0] : 'bg-slate-300'}
                    style={{ width: `${(x.count / statusTotal) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="font-semibold">Thanh toán</h2>
              <div className="mt-4 space-y-2">
                {breakdown.map((x) => (
                  <div key={x._id} className="flex items-center justify-between text-sm">
                    <span>{PAYMENT_STATUS[x._id]?.label || x._id}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{x.count}</span>
                      <span className="w-12 text-right text-xs text-slate-400">{Math.round((x.count / payTotal) * 100)}%</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full">
                {breakdown.map((x) => (
                  <div
                    key={x._id}
                    style={{ width: `${(x.count / payTotal) * 100}%` }}
                    className={x.color.match(/bg-[\w-]+/)?.[0] || 'bg-slate-300'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold">Bảng doanh thu 12 tháng</h2>
        <p className="text-sm text-slate-500">Doanh thu (Đã duyệt + Hoàn thành) và số tiền thực thu</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="pb-2">Tháng</th>
                <th className="pb-2">Đơn tour</th>
                <th className="pb-2">Doanh thu tour</th>
                <th className="pb-2">Đơn KS</th>
                <th className="pb-2">Doanh thu KS</th>
                <th className="pb-2">Tổng doanh thu</th>
                <th className="pb-2">Đã thu</th>
              </tr>
            </thead>
            <tbody>
              {[...data.monthly].reverse().map((m) => (
                <tr key={m.key} className="border-b">
                  <td className="py-2 capitalize">{m.label}</td>
                  <td className="py-2">{m.orders}</td>
                  <td className="py-2">{formatCurrency(m.revenue)}</td>
                  <td className="py-2">{m.hotelOrders}</td>
                  <td className="py-2">{formatCurrency(m.hotelRevenue)}</td>
                  <td className="py-2 font-medium">{formatCurrency(m.revenue + m.hotelRevenue)}</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {formatCurrency(m.collected)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}