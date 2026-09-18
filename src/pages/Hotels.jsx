import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import HotelCard from "../components/HotelCard";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import { PROVINCES } from "../constants";

const PAGE_SIZE = 9;

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const resultsRef = useRef(null);
  const [filters, setFilters] = useState({
    province: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    starRating: "",
    featured: "",
  });

  const starOptions = [
    { value: "", label: "Tất cả hạng sao" },
    { value: "2", label: "2 sao" },
    { value: "3", label: "3 sao" },
    { value: "4", label: "4 sao" },
    { value: "5", label: "5 sao" },
  ];

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
      starRating: "",
      featured: "",
    });
    setPage(1);
  };

  const goToPage = (next) => {
    const clamped = Math.min(Math.max(1, next), pagination.pages || 1);
    setPage(clamped);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.province) params.set("province", filters.province);
    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.starRating) params.set("starRating", filters.starRating);
    if (filters.featured) params.set("featured", filters.featured);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    api
      .get(`/hotels?${params}`)
      .then((res) => {
        const payload = res.data;
        setHotels(payload.data ?? payload);
        setPagination({
          pages: payload.pages ?? 1,
          total: payload.total ?? (payload.length ?? 0),
        });
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading text-3xl font-bold">
          Khách sạn Miền Tây
        </h1>
        {(filters.province ||
          filters.search ||
          filters.minPrice ||
          filters.maxPrice ||
          filters.starRating ||
          filters.featured) && (
          <button
            onClick={resetFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
      <p className="mt-2 text-slate-600">
        Tìm và đặt khách sạn phù hợp với ngân sách và khu vực của bạn
      </p>

      {/* Filter Section */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tìm kiếm
            </label>
            <input
              className="input-field w-full"
              placeholder="Tên khách sạn, mô tả..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
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

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hạng sao
            </label>
            <select
              className="input-field w-full"
              value={filters.starRating}
              onChange={(e) => handleFilterChange("starRating", e.target.value)}
            >
              {starOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Giá từ (VNĐ/đêm)
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
              Giá đến (VNĐ/đêm)
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
                Chỉ khách sạn nổi bật
              </span>
            </label>
          </div>
        </div>

        {/* Filter Summary */}
        {(filters.province ||
          filters.search ||
          filters.minPrice ||
          filters.maxPrice ||
          filters.starRating ||
          filters.featured) && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Đang hiển thị{" "}
              <span className="font-semibold text-slate-700">
                {pagination.total}
              </span>{" "}
              khách sạn phù hợp
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : hotels.length === 0 ? (
        <div className="mt-10 text-center py-16 bg-slate-50 rounded-xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-800">
            Không tìm thấy khách sạn
          </h3>
          <p className="text-slate-500 mt-2">
            Vui lòng thử thay đổi điều kiện lọc
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Xem tất cả khách sạn
          </button>
        </div>
      ) : (
        <div ref={resultsRef} className="mt-8">
          <div className="grid gap-6 md:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
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