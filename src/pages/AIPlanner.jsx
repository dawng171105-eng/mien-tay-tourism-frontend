import { useState } from "react";
import { Link } from "react-router-dom";
import { PROVINCES, formatCurrency, formatDate } from "../constants";
import Loading from "../components/Loading";
import TourCard from "../components/TourCard";

const INTERESTS = [
  "Sông nước",
  "Ẩm thực",
  "Miệt vườn",
  "Văn hóa",
  "Sinh thái",
  "Chợ nổi",
  "Nghỉ dưỡng nhẹ",
  "Khám phá",
];

const SUITABILITY = {
  good: { label: "Thuận lợi", color: "bg-green-100 text-green-800" },
  caution: { label: "Cần lưu ý", color: "bg-yellow-100 text-yellow-800" },
  poor: { label: "Không thuận lợi", color: "bg-red-100 text-red-800" },
};

function defaultStartDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

export default function AIPlanner() {
  const [form, setForm] = useState({
    province: "",
    startDate: defaultStartDate(),
    days: 3,
    travelers: 2,
    interests: [],
    budget: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function toggleInterest(interest) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!form.province) {
      setError("Vui lòng chọn điểm đến.");
      return;
    }
    if (form.interests.length === 0) {
      setError("Vui lòng chọn ít nhất 1 sở thích.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        province: form.province,
        startDate: form.startDate,
        days: Number(form.days),
        travelers: Number(form.travelers),
        interests: form.interests,
        ...(form.budget !== "" ? { budget: Number(form.budget) } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim().slice(0, 500) } : {}),
      };
      // Plain fetch (not the shared axios instance) so HTTP status and the
      // structured fallback body (503 + recommendedTours + weather) survive.
      const baseURL =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD
          ? "https://your-railway-backend-url.up.railway.app/api"
          : "http://localhost:5000/api");
      const res = await fetch(`${baseURL}/ai/travel-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw { status: res.status, data };
      }
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const fallback = err?.data;
      if (err?.status === 503 && fallback) {
        setError(fallback.message || "Không thể sử dụng phân tích AI lúc này.");
        if (fallback.recommendedTours?.length > 0 || fallback.weather) {
          setResult(fallback);
        }
      } else {
        setError(
          fallback?.message || err?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const suitability = result?.weather ? SUITABILITY[result.weather.travelSuitability] || SUITABILITY.caution : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          ✨ Trợ lý Du lịch AI
        </h1>
        <p className="mt-2 text-slate-600">
          Lên lịch trình Miền Tây phù hợp với thời tiết và sở thích của bạn.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}{" "}
          <Link to="/tours" className="font-medium underline">
            Bạn vẫn có thể xem danh sách tour.
          </Link>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit} className="card h-fit space-y-4 lg:col-span-1">
          <h2 className="font-heading text-xl font-bold">Lập lịch trình AI</h2>

          <div>
            <label className="mb-1 block text-sm font-medium">Điểm đến *</label>
            <select
              className="input-field"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              required
            >
              <option value="">-- Chọn tỉnh/thành --</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Ngày đi *</label>
              <input
                className="input-field"
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Số ngày *</label>
              <input
                className="input-field"
                type="number"
                min={1}
                max={10}
                required
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Số khách *</label>
            <input
              className="input-field"
              type="number"
              min={1}
              max={20}
              required
              value={form.travelers}
              onChange={(e) => setForm({ ...form, travelers: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Sở thích *</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    form.interests.includes(interest)
                      ? "bg-river-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Ngân sách (VND, cả đoàn — không bắt buộc)
            </label>
            <input
              className="input-field"
              type="number"
              min={0}
              placeholder="Ví dụ: 5000000"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ghi chú thêm (không bắt buộc)</label>
            <textarea
              className="input-field"
              rows={3}
              maxLength={500}
              placeholder="Ví dụ: đi cùng người lớn tuổi, thích đi sáng sớm..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "AI đang phân tích thời tiết và xây dựng lịch trình..." : "✨ Tạo lịch trình"}
          </button>
        </form>

        {/* Results */}
        <div className="lg:col-span-2">
          {loading && <Loading />}

          {!loading && !result && (
            <div className="card text-center text-slate-500">
              <div className="text-5xl">🗺️</div>
              <p className="mt-4">
                Điền thông tin chuyến đi và nhấn “Tạo lịch trình” để AI phân tích
                thời tiết và gợi ý lịch trình phù hợp.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6">
              {/* Weather card */}
              {result.weather && (
                <div className="card">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-heading text-xl font-bold">
                      🌤️ Phân tích thời tiết — {result.destination}
                    </h2>
                    {suitability && (
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${suitability.color}`}>
                        {suitability.label}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-slate-600">{result.weather.summary}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {result.weather.temperature && (
                      <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <span className="font-medium">🌡️ Nhiệt độ: </span>
                        {result.weather.temperature}
                      </div>
                    )}
                    {result.weather.condition && (
                      <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <span className="font-medium">☁️ Điều kiện: </span>
                        {result.weather.condition}
                      </div>
                    )}
                    {result.weather.rainRisk && (
                      <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <span className="font-medium">🌧️ Nguy cơ mưa: </span>
                        {result.weather.rainRisk}
                      </div>
                    )}
                    {result.weather.humidity && (
                      <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <span className="font-medium">💧 Độ ẩm: </span>
                        {result.weather.humidity}
                      </div>
                    )}
                    {result.weather.wind && (
                      <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <span className="font-medium">💨 Gió: </span>
                        {result.weather.wind}
                      </div>
                    )}
                    {result.weather.feelsLike && (
                      <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <span className="font-medium">🥵 Cảm giác: </span>
                        {result.weather.feelsLike}
                      </div>
                    )}
                  </div>
                  {result.weather.notes?.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {result.weather.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* AI overview */}
              {result.aiSummary && (
                <div className="card">
                  <h2 className="font-heading text-xl font-bold">🤖 Đánh giá điều kiện du lịch</h2>
                  <p className="mt-2 whitespace-pre-line text-slate-600">{result.aiSummary}</p>
                </div>
              )}

              {/* Itinerary */}
              {result.itinerary?.length > 0 && (
                <div className="card">
                  <h2 className="font-heading text-xl font-bold">🗓️ Lịch trình gợi ý</h2>
                  <div className="mt-4 space-y-4">
                    {result.itinerary.map((day) => (
                      <div key={day.day} className="rounded-lg border border-slate-100 p-4">
                        <h3 className="font-bold text-river-700">
                          Ngày {day.day}: {day.title}
                        </h3>
                        {day.activities?.length > 0 && (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                            {day.activities.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        )}
                        {day.weatherAdvice && (
                          <p className="mt-2 text-sm text-slate-500">
                            🌤️ <em>{day.weatherAdvice}</em>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended tours */}
              {result.recommendedTours?.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-xl font-bold">🛶 Tour phù hợp</h2>
                    <Link
                      to={`/tours?province=${encodeURIComponent(result.destination)}`}
                      className="btn-secondary text-sm"
                    >
                      Xem tour phù hợp
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {result.recommendedTours.map((tour) => (
                      tour._id || tour.id ? (
                        <TourCard
                          key={tour._id || tour.id}
                          tour={{ ...tour, _id: tour._id || tour.id }}
                        />
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {/* Packing tips */}
              {result.packingTips?.length > 0 && (
                <div className="card">
                  <h2 className="font-heading text-xl font-bold">🎒 Gợi ý mang theo</h2>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {result.packingTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {result.warnings?.length > 0 && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <h2 className="font-bold text-yellow-800">⚠️ Lưu ý thời tiết</h2>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-800">
                    {result.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.disclaimer && (
                <p className="text-xs text-slate-400">{result.disclaimer}</p>
              )}

              {result.trip && (
                <p className="text-xs text-slate-400">
                  Chuyến đi: {result.trip.travelers} khách • {formatDate(result.trip.startDate)} –{" "}
                  {formatDate(result.trip.endDate)}
                  {result.trip.budget != null ? ` • Ngân sách ${formatCurrency(result.trip.budget)}` : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
