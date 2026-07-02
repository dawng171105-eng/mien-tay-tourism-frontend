import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-2">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <span className="text-slate-300" aria-hidden="true">
                  /
                </span>
              )}
              {isLast ? (
                <span className="text-slate-700 font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-river-600 transition truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
