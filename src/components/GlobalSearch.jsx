import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { formatCurrency } from "../constants";

const RECENT_SEARCHES_KEY = "mien_tay_recent_searches";
const MAX_RECENT = 5;

function getRecentSearches() {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const recent = getRecentSearches().filter(
    (s) => s.toLowerCase() !== trimmed.toLowerCase(),
  );
  recent.unshift(trimmed);
  if (recent.length > MAX_RECENT) recent.pop();
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

/**
 * GlobalSearch - Component tìm kiếm toàn cục (modal overlay)
 * Được mở từ Navbar qua nút tìm kiếm hoặc phím tắt Ctrl+K / Cmd+K
 */
export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ tours: [], news: [] });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  // Focus input khi mở
  useEffect(() => {
    if (isOpen) {
      // Delay nhẹ để modal transition xong
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
    // Reset state khi đóng
    setQuery("");
    setResults({ tours: [], news: [] });
    setSelectedIndex(0);
    setRecentSearches(getRecentSearches());
  }, [isOpen]);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // onClose ở đây thực chất là setIsOpen(true) - được gọi từ Navbar
          // Ta dùng custom event để mở
          window.dispatchEvent(new CustomEvent("open-global-search"));
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  const performSearch = useCallback(async (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      setResults({ tours: [], news: [] });
      return;
    }

    setLoading(true);
    try {
      const [tourRes, newsRes] = await Promise.allSettled([
        api.get(`/tours?search=${encodeURIComponent(trimmed)}&limit=5`),
        api.get(`/news?search=${encodeURIComponent(trimmed)}&limit=5`),
      ]);

      setResults({
        tours: tourRes.status === "fulfilled" ? tourRes.value.data || [] : [],
        news: newsRes.status === "fulfilled" ? newsRes.value.data || [] : [],
      });
    } catch {
      setResults({ tours: [], news: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults({ tours: [], news: [] });
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  // Tính tổng số kết quả để điều hướng bàn phím
  const allResults = [...results.tours, ...results.news];
  const totalResults = allResults.length;

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, totalResults - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        handleSelect(allResults[selectedIndex]);
      } else if (query.trim().length >= 2) {
        // Enter để xem tất cả kết quả
        saveRecentSearch(query);
        onClose();
        navigate(`/tours?search=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  function handleSelect(item) {
    saveRecentSearch(item.title || item.name || query);
    onClose();
    if (item.price !== undefined) {
      // Tour
      navigate(`/tours/${item._id}`);
    } else {
      // News
      navigate(`/news/${item._id}`);
    }
  }

  function handleRecentClick(term) {
    setQuery(term);
    performSearch(term);
    inputRef.current?.focus();
  }

  function clearAllRecent() {
    clearRecentSearches();
    setRecentSearches([]);
  }

  const showRecent = !query.trim() && recentSearches.length > 0;
  const showEmpty = query.trim().length >= 2 && !loading && totalResults === 0;
  const showResults = totalResults > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
          <svg
            className="w-5 h-5 text-slate-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Tìm tour, địa điểm, tin tức..."
            className="flex-1 text-base outline-none text-slate-800 placeholder:text-slate-400 bg-transparent"
          />
          {loading && (
            <svg
              className="w-5 h-5 text-river-600 animate-spin shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1 shrink-0"
            aria-label="Đóng tìm kiếm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[50vh] overflow-y-auto">
          {/* Recent Searches */}
          {showRecent && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tìm kiếm gần đây
                </span>
                <button
                  onClick={clearAllRecent}
                  className="text-xs text-river-600 hover:text-river-700 transition"
                >
                  Xoá tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentClick(term)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {showEmpty && (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 text-slate-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-slate-500 text-sm">
                Không tìm thấy kết quả cho{" "}
                <span className="font-semibold text-slate-700">"{query}"</span>
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Thử lại với từ khóa khác
              </p>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="p-2">
              {/* Tours */}
              {results.tours.length > 0 && (
                <div className="mb-2">
                  <span className="block px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tour du lịch ({results.tours.length})
                  </span>
                  {results.tours.map((tour, idx) => {
                    const globalIdx = idx;
                    const isSelected = selectedIndex === globalIdx;
                    return (
                      <button
                        key={tour._id}
                        onClick={() => handleSelect(tour)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full text-left px-3 py-3 rounded-xl transition flex items-center gap-3 ${
                          isSelected
                            ? "bg-river-50 text-river-800"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                          {tour.image ? (
                            <img
                              src={tour.image}
                              alt={tour.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {tour.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {tour.duration} • {formatCurrency(tour.price)}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-slate-300 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* News */}
              {results.news.length > 0 && (
                <div>
                  <span className="block px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tin tức ({results.news.length})
                  </span>
                  {results.news.map((item, idx) => {
                    const globalIdx = results.tours.length + idx;
                    const isSelected = selectedIndex === globalIdx;
                    return (
                      <button
                        key={item._id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full text-left px-3 py-3 rounded-xl transition flex items-center gap-3 ${
                          isSelected
                            ? "bg-river-50 text-river-800"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.summary || item.description || ""}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-slate-300 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* View All */}
              <div className="px-3 py-2 border-t border-slate-100 mt-1">
                <Link
                  to={`/tours?search=${encodeURIComponent(query.trim())}`}
                  onClick={() => {
                    saveRecentSearch(query);
                    onClose();
                  }}
                  className="text-sm text-river-600 hover:text-river-700 font-medium transition"
                >
                  Xem tất cả kết quả →
                </Link>
              </div>
            </div>
          )}

          {/* Quick Start (no query, no recent) */}
          {!query.trim() && !showRecent && (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-400">
                Gõ từ khóa để tìm tour, địa điểm, tin tức...
              </p>
              <p className="text-xs text-slate-300 mt-2">
                Nhấn{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 text-xs font-mono">
                  Ctrl+K
                </kbd>{" "}
                để mở nhanh
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">
                ↑↓
              </kbd>{" "}
              Điều hướng
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">
                ↵
              </kbd>{" "}
              Chọn
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">
                Esc
              </kbd>{" "}
              Đóng
            </span>
          </div>
          <span className="text-xs text-slate-300">Mien Tay Tourism</span>
        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

/**
 * Hook để sử dụng GlobalSearch từ bất kỳ component nào
 * Trả về { openSearch, closeSearch, isOpen }
 */
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      setIsOpen(true);
    }
    window.addEventListener("open-global-search", handleOpen);
    return () => window.removeEventListener("open-global-search", handleOpen);
  }, []);

  return {
    isOpen,
    openSearch: () => setIsOpen(true),
    closeSearch: () => setIsOpen(false),
  };
}
