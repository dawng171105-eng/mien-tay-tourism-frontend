import { useState, useEffect } from "react";

const STORAGE_KEY = "cookieConsent";
const LEGACY_KEY = "cookie-consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (!saved) setShow(true);
  }, []);

  const persist = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    localStorage.removeItem(LEGACY_KEY);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Thông báo cookie"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:right-auto sm:p-0"
    >
      <div className="animate-slide-up rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:max-w-sm">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-xl leading-none">
            🍪
          </span>
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-700">Chúng tôi dùng cookie</p>
            <p className="mt-1">
              Trang web dùng cookie để nâng cao trải nghiệm. Xem{" "}
              <a
                href="/privacy"
                className="text-river-600 underline hover:text-river-700"
              >
                Chính sách bảo mật
              </a>
              .
            </p>
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => persist("rejected")}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Từ chối
          </button>
          <button
            onClick={() => persist("accepted")}
            className="rounded-lg bg-river-600 px-3 py-1.5 text-sm text-white transition hover:bg-river-700"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
