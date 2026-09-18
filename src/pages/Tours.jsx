import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import TourCard from "../components/TourCard";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import { PROVINCES, TOUR_TYPES, TOUR_DURATIONS, SORT_OPTIONS } from "../constants";

const PAGE_SIZE = 12;

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const resultsRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    province: searchParams.get("province") || "",
    search: searchParams.get("search") || "",
    minPrice: "",
    maxPrice: "",
    duration: "",
    featured: "",
    type: "",
    sort: "-featured -createdAt",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      province: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      duration: "",
      featured: "",
      type: "",
      sort: "-featured -createdAt",
    });
    setPage(1);
  };

  const goToPage = (next) => {
    const clamped = Math.min(Math.max(1, next), pagination.pages || 1);
    setPage(clamped);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.province) params.set("province", filters.province);
    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.duration) params.set("duration", filters.duration);
    if (filters.featured) params.set("featured", filters.featured);
    if (filters.type) params.set("type", filters.type);
    if (activeTab === "combo") params.set("isCombo", "true");
    if (activeTab === "single") params.set("isCombo", "false");
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    api
      .get(`/tours?${params}`)
      .then((res) => {
        const payload = res.data;
        setTours(payload.data ?? payload);
        setPagination({
          pages: payload.pages ?? 1,
          total: payload.total ?? (payload.length ?? 0),
        });
      })
      .finally(() => setLoading(false));
  }, [filters, activeTab, page]);

  const hasActiveFilters = 
    filters.province ||
    filters.search ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.duration ||
    filters.featured ||
    filters.type;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            Tour du lịch Miền Tây
          </h1>
          <p className="mt-2 text-slate-600">
            Tìm và đặt tour phù hợp với ngân sách và khu vực của bạn
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
          >
            <span>🔄</span> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-4 border-b border-slate-200">
        <button
          onClick={() => changeTab("all")}
          className={`pb-3 px-2 border-b-2 font-medium transition ${
            activeTab === "all"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Tất cả tour
        </button>
        <button
          onClick={() => changeTab("combo")}
          className={`pb-3 px-2 border-b-2 font-medium transition ${
            activeTab === "combo"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Combo Liên tỉnh
        </button>
        <button
          onClick={() => changeTab("single")}
          className={`pb-3 px-2 border-b-2 font-medium transition ${
            activeTab === "single"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Tour đơn tỉnh
        </button>
      </div>

      {/* Filter Section */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {/* Search */}
          <div className="lg:col-span-2 xl:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tìm kiếm
            </label>
            <input
              className="input-field w-full"
              placeholder="Tên tour, mô tả..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Loại tour
            </label>
            <select
              className="input-field w-full"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              {TOUR_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tỉnh thành
            </label>
            <select
              className="input-field w-full"
              value={filters.province}
              onChange={(e) => handleFilterChange("province", e.target.value)}
            >
              <option value="">Tất cả tỉnh</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Thời gian
            </label>
            <select
              className="input-field w-full"
              value={filters.duration}
              onChange={(e) => handleFilterChange("duration", e.target.value)}
            >
              {TOUR_DURATIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sắp xếp
            </label>
            <select
              className="input-field w-full"
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giá từ (VNĐ)
            </label>
            <input
              className="input-field w-full"
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giá đến (VNĐ)
            </label>
            <input
              className="input-field w-full"
              type="number"
              placeholder="10,000,000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>

          {/* Featured */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.featured === "true"}
                onChange={(e) =>
                  handleFilterChange("featured", e.target.checked ? "true" : "")
                }
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Chỉ tour nổi bật
              </span>
            </label>
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Đang hiển thị{" "}
              <span className="font-semibold text-slate-700">
                {pagination.total}
              </span>{" "}
              tour phù hợp
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : tours.length === 0 ? (
        <div className="mt-10 text-center py-16 bg-slate-50 rounded-xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-800">
            Không tìm thấy tour
          </h3>
          <p className="text-slate-500 mt-2">
            Vui lòng thử thay đổi điều kiện lọc
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Xem tất cả tour
          </button>
        </div>
      ) : (
        <div ref={resultsRef} className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
          <Pagination
            page={page}
            pages={pagination.pages}
            onChange={goToPage}
            className="mt-10"
          />
        </div>
      )}
    </div>
  );
}
