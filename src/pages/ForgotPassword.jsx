import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-heading text-2xl font-bold text-slate-800 mb-4"
          >
            <span aria-hidden="true">🌾</span>
            <span>Du Lịch Miền Tây</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Quên mật khẩu</h1>
          <p className="text-slate-500 mt-2">
            {sent ? "Kiểm tra email của bạn" : "Nhập email để đặt lại mật khẩu"}
          </p>
        </div>

        <div className="bg-white rounded-xl border p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-slate-600 mb-4">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{" "}
                <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến và thư
                mục spam.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-river-600 hover:underline text-sm"
              >
                Gửi lại email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-river-500"
                  placeholder="email@example.com"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Gửi yêu cầu
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          <Link
            to="/login"
            className="text-river-600 hover:underline font-medium"
          >
            ← Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
