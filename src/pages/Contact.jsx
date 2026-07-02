import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Breadcrumb
          items={[{ label: "Trang chủ", to: "/" }, { label: "Liên hệ" }]}
        />
      </div>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-heading text-4xl font-bold text-slate-800 mb-4">
            Liên Hệ
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mb-12">
            Bạn có câu hỏi hoặc cần tư vấn về tour du lịch miền Tây? Đội ngũ của
            chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
          </p>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    Gửi thành công!
                  </h2>
                  <p className="text-green-600">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24
                    giờ.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-xl border p-6 space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-river-500"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-river-500"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-river-500"
                        placeholder="0987 654 321"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Chủ đề
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-river-500"
                      >
                        <option value="">-- Chọn chủ đề --</option>
                        <option value="tour">Tư vấn tour du lịch</option>
                        <option value="booking">Đặt tour / Thanh toán</option>
                        <option value="cancellation">Hủy / Đổi tour</option>
                        <option value="complaint">Khiếu nại / Góp ý</option>
                        <option value="partnership">Hợp tác kinh doanh</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nội dung tin nhắn *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-river-500"
                      placeholder="Nhập nội dung bạn cần tư vấn..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Gửi tin nhắn
                  </button>
                </form>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Thông tin liên hệ
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="text-xl">📍</span>
                    <div>
                      <strong>Địa chỉ:</strong>
                      <br />
                      123 Nguyễn Trãi, Quận Ninh Kiều, TP. Cần Thơ
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">📞</span>
                    <div>
                      <strong>Hotline:</strong>
                      <br />
                      1900 1234 - 0987 654 321
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">📧</span>
                    <div>
                      <strong>Email:</strong>
                      <br />
                      info@dulichmientay.vn
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl">🕐</span>
                    <div>
                      <strong>Giờ làm việc:</strong>
                      <br />
                      08:00 - 21:00 (Thứ 2 - Chủ Nhật)
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  Kết nối với chúng tôi
                </h3>
                <div className="flex gap-3">
                  {[
                    {
                      icon: "📘",
                      label: "Facebook",
                      href: "https://facebook.com/dulichmientay",
                    },
                    {
                      icon: "📸",
                      label: "Instagram",
                      href: "https://instagram.com/dulichmientay",
                    },
                    {
                      icon: "▶️",
                      label: "YouTube",
                      href: "https://youtube.com/@dulichmientay",
                    },
                    {
                      icon: "🎵",
                      label: "TikTok",
                      href: "https://tiktok.com/@dulichmientay",
                    },
                    {
                      icon: "💬",
                      label: "Zalo",
                      href: "https://zalo.me/dulichmientay",
                    },
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-slate-50 transition text-sm text-slate-600"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
