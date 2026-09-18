import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Loading from "../components/Loading";
import SafeImage from "../components/SafeImage";
import StarRating from "../components/StarRating";
import SocialShare from "../components/SocialShare";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatDate, SHARED_IMAGES, TOUR_TYPES } from "../constants";

const getTourTypeLabel = (type) => {
  const typeObj = TOUR_TYPES.find((t) => t.value === type);
  return typeObj ? typeObj.label : type;
};

export default function TourDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    departureDate: "",
    passengers: 1,
    notes: "",
  });
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [childPassengers, setChildPassengers] = useState(0);

  useEffect(() => {
    Promise.all([api.get(`/tours/${id}`), api.get(`/reviews?tourId=${id}`)])
      .then(([tourRes, reviewRes]) => {
        setTour(tourRes.data);
        setReviews(reviewRes.data);
        if (tourRes.data.departures?.[0]) {
          setBooking((b) => ({
            ...b,
            departureDate: tourRes.data.departures[0].slice(0, 10),
          }));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBooking(e) {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (user.role !== "customer")
      return setError("Chỉ khách du lịch mới có thể đặt tour");

    setError("");
    setMessage("");
    try {
      await api.post("/bookings", {
        tourId: id,
        departureDate: booking.departureDate,
        passengers: Number(booking.passengers),
        childPassengers: Number(childPassengers),
        notes: booking.notes,
      });
      setMessage("Đặt tour thành công! Vui lòng chờ admin duyệt.");
      const tourRes = await api.get(`/tours/${id}`);
      setTour(tourRes.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReview(e) {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (user.role !== "customer")
      return setError("Chỉ khách du lịch mới có thể đánh giá");

    setError("");
    try {
      const res = await api.post("/reviews", { tourId: id, ...review });
      setReviews((prev) => [res.data, ...prev]);
      setReview({ rating: 5, comment: "" });
      setMessage("Cảm ơn bạn đã đánh giá!");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <Loading />;
  if (!tour) return <p className="p-10 text-center">Tour không tồn tại</p>;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const calculateTotal = () => {
    if (tour.priceAdult && tour.priceChild) {
      return (
        tour.priceAdult * booking.passengers + tour.priceChild * childPassengers
      );
    }
    return tour.price * (booking.passengers + childPassengers);
  };

  const totalPrice = calculateTotal();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/tours" className="text-sm text-river-600 hover:underline">
        ← Quay lại danh sách tour
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4">
            <SafeImage
              src={SHARED_IMAGES.tour}
              alt={tour.name}
              type="tour"
              className="aspect-video w-full rounded-xl object-cover"
              loading="eager"
            />
            {tour.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {tour.images.slice(1, 5).map((_, idx) => (
                  <SafeImage
                    key={idx}
                    src={SHARED_IMAGES.tour}
                    alt={`${tour.name} ${idx + 2}`}
                    type="tour"
                    className="aspect-video w-full rounded-lg object-cover"
                    loading="eager"
                  />
                ))}
              </div>
            )}
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold">{tour.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {tour.isCombo && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700 font-semibold">
                Combo Liên tỉnh
              </span>
            )}
            {tour.type && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                {getTourTypeLabel(tour.type)}
              </span>
            )}
            <span className="rounded-full bg-river-100 px-3 py-1 text-sm">
              {tour.province}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
              {tour.duration}
            </span>
            {avgRating && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm">
                ★ {avgRating} ({reviews.length} đánh giá)
              </span>
            )}
          </div>
          <div className="mt-4">
            <SocialShare
              title={tour.name}
              description={tour.description?.slice(0, 150)}
              image={SHARED_IMAGES.tour}
            />
          </div>
          {tour.provincesVisited?.length > 1 && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700">📌 Lộ trình:</p>
              <p className="text-slate-600">
                {tour.provincesVisited.join(" → ")}
              </p>
            </div>
          )}
          {tour.departurePoint && (
            <p className="mt-2 text-slate-600">
              🚩 Điểm khởi hành: {tour.departurePoint}
            </p>
          )}
          <p className="mt-4 text-slate-700">{tour.description}</p>

          {/* Itinerary Section */}
          <div className="card mt-6">
            <h2 className="font-semibold text-lg mb-4">
              📅 Lịch trình chi tiết
            </h2>

            {tour.dailyItinerary?.length > 0 ? (
              <div className="space-y-4">
                {tour.dailyItinerary.map((day, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-orange-200 bg-white shadow-sm overflow-hidden"
                  >
                    {/* Day Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3">
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </span>
                        Ngày {day.day}: {day.title}
                      </h3>
                    </div>

                    {/* Day Content */}
                    <div className="p-5 space-y-4">
                      {/* Activities */}
                      {day.activities?.length > 0 && (
                        <div className="space-y-2">
                          {day.activities.map((act, aIdx) => (
                            <div
                              key={aIdx}
                              className="flex items-start gap-3 text-slate-700 text-sm"
                            >
                              <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 shrink-0" />
                              <span>
                                {typeof act === "string"
                                  ? act
                                  : `${act.time}: ${act.description}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Meals & Accommodation */}
                      <div className="grid gap-3 sm:grid-cols-2 pt-3 border-t border-orange-100">
                        {day.meals && (
                          <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                            <span className="text-lg">🍴</span>
                            <div>
                              <p className="font-medium text-sm text-orange-700">
                                Bữa ăn
                              </p>
                              <p className="text-slate-600 text-sm">
                                {day.meals}
                              </p>
                            </div>
                          </div>
                        )}
                        {day.accommodation && (
                          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <span className="text-lg">🏨</span>
                            <div>
                              <p className="font-medium text-sm text-blue-700">
                                Nghỉ đêm
                              </p>
                              <p className="text-slate-600 text-sm">
                                {day.accommodation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                // Parse legacy text itinerary into day sections
                const rawItinerary = tour.itinerary || "";
                const daySections = rawItinerary
                  .split(/Ngày \d+/i)
                  .filter(Boolean);
                const dayHeaders =
                  rawItinerary.match(/Ngày \d+[:\-].*/gi) || [];

                if (dayHeaders.length === 0) {
                  // No day headers found, show as simple list
                  return (
                    <div className="rounded-xl border border-orange-200 bg-white shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3">
                        <h3 className="font-bold text-white text-lg">
                          📋 Lịch trình
                        </h3>
                      </div>
                      <div className="p-5">
                        <div className="space-y-2">
                          {rawItinerary
                            .split("\n")
                            .filter(Boolean)
                            .map((line, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 text-slate-700 text-sm"
                              >
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 shrink-0" />
                                <span>{line.trim()}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {dayHeaders.map((header, idx) => {
                      const lines = (daySections[idx] || "")
                        .split("\n")
                        .filter((l) => l.trim());
                      const dayNumber = header.match(/\d+/)?.[0] || idx + 1;
                      const title =
                        header.replace(/Ngày \d+[:\-]\s*/i, "").trim() ||
                        `Ngày ${dayNumber}`;

                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-orange-200 bg-white shadow-sm overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3">
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                              <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {dayNumber}
                              </span>
                              Ngày {dayNumber}: {title}
                            </h3>
                          </div>
                          <div className="p-5">
                            <div className="space-y-2">
                              {lines.map((line, lIdx) => (
                                <div
                                  key={lIdx}
                                  className="flex items-start gap-3 text-slate-700 text-sm"
                                >
                                  <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 shrink-0" />
                                  <span>{line.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>

          {/* Services Section */}
          <div className="card mt-6">
            <h2 className="font-semibold text-lg mb-4">📌 Dịch vụ tour</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Included */}
              <div className="rounded-xl border border-green-200 bg-gradient-to-b from-green-50 to-white overflow-hidden">
                <div className="bg-green-500 px-5 py-3">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span>✅</span> Dịch vụ bao gồm
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {tour.inclusions?.length > 0 ? (
                      tour.inclusions.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-slate-700 text-sm"
                        >
                          <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 text-sm">
                        Không có thông tin
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Right Column - Excluded */}
              <div className="rounded-xl border border-red-200 bg-gradient-to-b from-red-50 to-white overflow-hidden">
                <div className="bg-red-500 px-5 py-3">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span>❌</span> Dịch vụ không bao gồm
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {tour.exclusions?.length > 0 ? (
                      tour.exclusions.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-slate-700 text-sm"
                        >
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                            ✗
                          </span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 text-sm">
                        Không có thông tin
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Policies */}
            {tour.policies?.length > 0 && (
              <div className="mt-6 rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
                <div className="bg-blue-500 px-5 py-3">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span>📝</span> Chính sách tour
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {tour.policies.map((policy, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-700 text-sm"
                      >
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span>{policy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Notes */}
            {tour.notes?.length > 0 && (
              <div className="mt-6 rounded-xl border border-yellow-200 bg-gradient-to-b from-yellow-50 to-white overflow-hidden">
                <div className="bg-yellow-500 px-5 py-3">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span>ℹ️</span> Lưu ý quan trọng
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {tour.notes.map((note, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-slate-700 text-sm"
                      >
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-400 shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card sticky top-24">
            {tour.isCombo ? (
              <div>
                {tour.priceAdult && (
                  <div>
                    <p className="text-xl font-bold text-river-700">
                      {formatCurrency(tour.priceAdult)}
                    </p>
                    <p className="text-sm text-slate-500">/ Người lớn</p>
                  </div>
                )}
                {tour.priceChild && (
                  <div className="mt-2">
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(tour.priceChild)}
                    </p>
                    <p className="text-sm text-slate-500">/ Trẻ em</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-river-700">
                  {formatCurrency(tour.price)}
                </p>
                <p className="text-sm text-slate-500"> / khách</p>
              </div>
            )}
            <p className="text-sm text-slate-500 mt-2">
              Còn {tour.availableSlots}/{tour.maxSlots} chỗ
            </p>
            {tour.minSlots > 1 && (
              <p className="text-sm text-slate-500">
                Tối thiểu {tour.minSlots} khách
              </p>
            )}

            {message && (
              <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleBooking} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Ngày khởi hành
                </label>
                <select
                  className="input-field"
                  required
                  value={booking.departureDate}
                  onChange={(e) =>
                    setBooking({ ...booking, departureDate: e.target.value })
                  }
                >
                  {tour.departures?.map((d) => (
                    <option key={d} value={d.slice(0, 10)}>
                      {formatDate(d)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Số khách người lớn
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  max={tour.availableSlots}
                  required
                  value={booking.passengers}
                  onChange={(e) =>
                    setBooking({ ...booking, passengers: e.target.value })
                  }
                />
              </div>
              {(tour.priceAdult || tour.priceChild) && (
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Số khách trẻ em
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    max={tour.availableSlots}
                    value={childPassengers}
                    onChange={(e) => setChildPassengers(Number(e.target.value))}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Ghi chú
                </label>
                <textarea
                  className="input-field"
                  rows="2"
                  value={booking.notes}
                  onChange={(e) =>
                    setBooking({ ...booking, notes: e.target.value })
                  }
                />
              </div>
              <div className="border-t border-slate-200 pt-3">
                <p className="text-sm font-semibold text-slate-700">
                  Tổng tiền: {formatCurrency(totalPrice)}
                </p>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={
                  tour.availableSlots <
                  Number(booking.passengers) + childPassengers
                }
              >
                {tour.availableSlots <
                Number(booking.passengers) + childPassengers
                  ? "Hết chỗ"
                  : "Đặt tour ngay"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Đánh giá từ khách du lịch</h2>

        {user?.role === "customer" && (
          <form onSubmit={handleReview} className="card mt-4 max-w-xl">
            <StarRating
              value={review.rating}
              onChange={(rating) => setReview({ ...review, rating })}
            />
            <textarea
              className="input-field mt-3"
              rows="3"
              placeholder="Chia sẻ trải nghiệm của bạn..."
              required
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
            />
            <button type="submit" className="btn-primary mt-3">
              Gửi đánh giá
            </button>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-slate-500">Chưa có đánh giá nào</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="card">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.user?.name}</p>
                  <StarRating value={r.rating} readonly />
                </div>
                <p className="mt-2 text-slate-600">{r.comment}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(r.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
