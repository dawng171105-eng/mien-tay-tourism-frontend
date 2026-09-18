import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import Loading from '../components/Loading';
import SafeImage from '../components/SafeImage';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, SHARED_IMAGES } from '../constants';

/* ── Mapping tiện nghi → icon ── */
const amenityIcons = {
  wifi: '📶', hồ: '🏊', bể: '🏊', pool: '🏊',
  nhà: '🍽️', restaurant: '🍽️', spa: '💆', massage: '💆',
  gym: '🏋️', fitness: '🏋️', bar: '🍸', lounge: '🍸',
  xe: '🚗', shuttle: '🚗', bãi: '🅿️', parking: '🅿️',
  casino: '🎰', golf: '⛳', sân: '🎾', tennis: '🎾',
  lặn: '🤿', thuyền: '⛵', kayak: '🚣', câu: '🎣',
  tour: '🗺️', butler: '🛎️', kids: '👶', trẻ: '👶',
  helicopter: '🚁', sailing: '⛵', watersport: '🌊',
  yoga: '🧘', sauna: '🧖', phòng: '📋', hội: '🏛️',
};

function getAmenityIcon(amenity) {
  const lower = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (lower.includes(key)) return icon;
  }
  return '✨';
}

/* ── Tính số đêm ── */
function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/* ── Lấy ngày tối thiểu (hôm nay) ── */
function toDateInput(date) {
  return date.toISOString().split('T')[0];
}

export default function HotelDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  const today = toDateInput(new Date());
  const tomorrow = toDateInput(new Date(Date.now() + 86400000));

  const [form, setForm] = useState({ checkIn: today, checkOut: tomorrow, guests: 1, notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/hotels/${id}`)
      .then((r) => setHotel(r.data))
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [id]);

  const nights = calcNights(form.checkIn, form.checkOut);
  const total = hotel ? hotel.pricePerNight * nights * form.guests : 0;

  /* Tự động cập nhật checkout khi checkin thay đổi */
  const handleCheckInChange = useCallback((val) => {
    const next = toDateInput(new Date(new Date(val).getTime() + 86400000));
    setForm((f) => ({ ...f, checkIn: val, checkOut: f.checkOut <= val ? next : f.checkOut }));
  }, []);

  async function handleBooking(e) {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (user.role !== 'customer') return setError('Chỉ khách du lịch mới có thể đặt phòng');
    if (nights < 1) return setError('Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm');

    setError(''); setMessage(''); setSubmitting(true);
    try {
      await api.post('/hotel-bookings', {
        hotelId: id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        notes: form.notes,
      });
      setMessage(`🎉 Đặt phòng thành công! Tổng ${formatCurrency(total)} cho ${nights} đêm. Vui lòng chờ xác nhận.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;
  if (!hotel) return (
    <div className="py-20 text-center">
      <p className="text-xl text-slate-500">Khách sạn không tồn tại</p>
      <Link to="/hotels" className="mt-4 inline-block text-river-600 hover:underline">← Quay lại danh sách</Link>
    </div>
  );

  const mapQ = encodeURIComponent(`${hotel.name} ${hotel.address} Việt Nam`);
  const mapSrc = `https://maps.google.com/maps?q=${mapQ}&output=embed&hl=vi&z=15`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/hotels" className="hover:text-river-600 transition-colors">Khách sạn</Link>
        <span>›</span>
        <span className="text-slate-700 font-medium">{hotel.name}</span>
      </div>

      {/* ── Gallery ── */}
      <div className="mt-4 grid gap-2 grid-cols-1 lg:grid-cols-4">
        {/* Ảnh chính */}
        <div className="lg:col-span-3 relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-200 shadow-md">
          <SafeImage
            src={SHARED_IMAGES.hotel}
            alt={hotel.name}
            type="hotel"
            className="w-full h-full object-cover transition-all duration-500"
            loading="eager"
          />
          {/* Arrows */}
          {hotel.images?.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((i) => (i - 1 + hotel.images.length) % hotel.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition"
              >‹</button>
              <button
                onClick={() => setActiveImg((i) => (i + 1) % hotel.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition"
              >›</button>
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {activeImg + 1} / {hotel.images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hotel.images?.length > 1 && (
          <div className="flex lg:flex-col gap-2 overflow-auto lg:overflow-y-auto max-h-[400px]">
            {hotel.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-24 lg:w-full aspect-video rounded-xl overflow-hidden border-2 transition ${
                  i === activeImg ? 'border-river-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <SafeImage src={SHARED_IMAGES.hotel} alt={`${hotel.name} ${i + 1}`} type="hotel" className="w-full h-full object-cover" loading="eager" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* ── Cột trái ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tên & thông tin cơ bản */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-river-100 px-3 py-1 text-sm font-medium text-river-700">
                📍 {hotel.province}
              </span>
              <div className="flex gap-0.5 text-xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < hotel.starRating ? 'text-yellow-400' : 'text-slate-200'}>★</span>
                ))}
              </div>
              {hotel.featured && (
                <span className="rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 text-xs font-bold">
                  ⚡ NỔI BẬT
                </span>
              )}
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold text-slate-800">{hotel.name}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <span>📍</span>
              <span>{hotel.address}</span>
            </p>
          </div>

          {/* Mô tả */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-slate-800 mb-3">Giới thiệu</h2>
            <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Tiện nghi */}
          {hotel.amenities?.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-slate-800 mb-4">Tiện nghi & Dịch vụ</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 border border-slate-100"
                  >
                    <span className="text-lg">{getAmenityIcon(amenity)}</span>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-hidden">
            <h2 className="font-heading text-xl font-bold text-slate-800 mb-4">📍 Vị trí trên bản đồ</h2>
            <p className="text-sm text-slate-500 mb-4">{hotel.address}</p>
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 380 }}>
              <iframe
                title="Google Maps"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-river-600 hover:text-river-700 font-medium transition-colors"
            >
              <span>🗺️</span>
              Mở trong Google Maps
            </a>
          </div>
        </div>

        {/* ── Cột phải: Form đặt phòng ── */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
            {/* Giá */}
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-bold text-river-700">
                {formatCurrency(hotel.pricePerNight)}
              </span>
              <span className="text-slate-500 mb-0.5">/đêm</span>
            </div>
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < hotel.starRating ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
              ))}
              <span className="ml-1 text-xs text-slate-500">{hotel.starRating} sao</span>
            </div>

            {/* Thông báo */}
            {message && (
              <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Check-in / Check-out */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-1">
                <div className="p-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
                    Nhận phòng
                  </label>
                  <input
                    type="date"
                    className="w-full text-sm font-semibold text-slate-800 bg-transparent outline-none"
                    min={today}
                    value={form.checkIn}
                    required
                    onChange={(e) => handleCheckInChange(e.target.value)}
                  />
                </div>
                <div className="p-2 border-l border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
                    Trả phòng
                  </label>
                  <input
                    type="date"
                    className="w-full text-sm font-semibold text-slate-800 bg-transparent outline-none"
                    min={form.checkIn || today}
                    value={form.checkOut}
                    required
                    onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
                  />
                </div>
              </div>

              {/* Số khách */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Số khách
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, guests: Math.max(1, f.guests - 1) }))}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center transition"
                  >−</button>
                  <span className="flex-1 text-center font-bold text-slate-800 text-lg">{form.guests}</span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, guests: f.guests + 1 }))}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center transition"
                  >+</button>
                </div>
                <p className="mt-1 text-xs text-slate-400">người lớn</p>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Yêu cầu đặc biệt
                </label>
                <textarea
                  className="input-field text-sm"
                  rows={2}
                  placeholder="Phòng tầng cao, view biển, giường đôi..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>

              {/* Tính giá */}
              {nights > 0 && (
                <div className="rounded-xl bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>{formatCurrency(hotel.pricePerNight)} × {nights} đêm × {form.guests} khách</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800 text-base">
                    <span>Tổng cộng</span>
                    <span className="text-river-700">{formatCurrency(total)}</span>
                  </div>
                </div>
              )}

              {/* Nút đặt */}
              <button
                type="submit"
                disabled={submitting || nights < 1}
                className="w-full rounded-xl bg-gradient-to-r from-river-600 to-river-500 text-white py-3.5 font-bold text-base shadow-md hover:shadow-lg hover:from-river-700 hover:to-river-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? '⏳ Đang xử lý...' : user ? '🏨 Đặt phòng ngay' : '🔐 Đăng nhập để đặt phòng'}
              </button>

              {!user && (
                <p className="text-center text-xs text-slate-400">
                  <Link to="/login" className="text-river-600 font-medium hover:underline">Đăng nhập</Link>
                  {' '}để đặt phòng và nhận ưu đãi thành viên
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
