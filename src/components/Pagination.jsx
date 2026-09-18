export default function Pagination({ page, pages, onChange, className = "" }) {
  if (!pages || pages <= 1) return null;

  const items = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i += 1) items.push(i);
  } else {
    items.push(1);
    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);
    if (start > 2) items.push("start-ellipsis");
    for (let i = start; i <= end; i += 1) items.push(i);
    if (end < pages - 1) items.push("end-ellipsis");
    items.push(pages);
  }

  const baseBtn =
    "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Phân trang"
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${baseBtn} border-slate-300 bg-white text-slate-600 hover:bg-slate-50`}
      >
        ‹ Trước
      </button>

      {items.map((item, idx) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${baseBtn} ${
              item === page
                ? "border-river-600 bg-river-600 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="px-1 text-slate-400">
            …
          </span>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className={`${baseBtn} border-slate-300 bg-white text-slate-600 hover:bg-slate-50`}
      >
        Sau ›
      </button>
    </nav>
  );
}
