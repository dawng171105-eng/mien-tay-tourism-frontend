import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("cookie-consent");
    if (!consented) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t shadow-2xl p-4 md:p-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 text-sm text-slate-600">
            <p>
              🍪 Trang web này sử dụng cookie để nâng cao trải nghiệm người
              dùng. Bằng cách tiếp tục sử dụng, bạn đồng ý với{" "}
              <a
                href="/privacy"
                className="text-river-600 underline hover:text-river-700"
              >
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Từ chối
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-river-600 text-white rounded-lg hover:bg-river-700 transition"
            >
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
