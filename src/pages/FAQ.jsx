import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

const faqs = [
  {
    category: "Đặt tour & Thanh toán",
    questions: [
      {
        q: "Làm thế nào để đặt tour?",
        a: "Bạn có thể đặt tour trực tuyến trên website bằng cách chọn tour mong muốn, nhập thông tin và thanh toán. Hoặc gọi hotline 1900 1234 để được tư vấn viên hỗ trợ đặt tour.",
      },
      {
        q: "Tôi có thể thanh toán bằng những phương thức nào?",
        a: "Chúng tôi chấp nhận: chuyển khoản ngân hàng, thẻ Visa/Mastercard, ví Momo, ZaloPay, và thanh toán tiền mặt tại văn phòng.",
      },
      {
        q: "Sau khi đặt tour, tôi nhận được xác nhận như thế nào?",
        a: "Bạn sẽ nhận được email xác nhận đặt tour kèm mã booking và thông tin chi tiết tour. Chúng tôi cũng sẽ gọi điện xác nhận trong vòng 24h.",
      },
      {
        q: "Tôi có thể đặt tour cho nhóm lớn không?",
        a: "Có! Chúng tôi có chính sách ưu đãi đặc biệt cho nhóm từ 10 người trở lên. Vui lòng liên hệ hotline để được tư vấn.",
      },
    ],
  },
  {
    category: "Hủy & Đổi tour",
    questions: [
      {
        q: "Chính sách hủy tour như thế nào?",
        a: "Hủy trước 7 ngày: hoàn 100%. Hủy trước 3-6 ngày: hoàn 70%. Hủy trước 1-2 ngày: hoàn 50%. Hủy trong ngày: không hoàn tiền. Chi tiết xem tại trang Chính sách.",
      },
      {
        q: "Tôi có thể đổi lịch tour không?",
        a: "Bạn có thể đổi lịch miễn phí trước 3 ngày khởi hành. Đổi lịch trong vòng 1-2 ngày sẽ tính phí 10% giá trị tour.",
      },
      {
        q: "Nếu tour bị hủy do thời tiết xấu?",
        a: "Chúng tôi sẽ hoàn 100% tiền tour hoặc sắp xếp lịch khởi hành mới phù hợp cho bạn.",
      },
    ],
  },
  {
    category: "Tour & Dịch vụ",
    questions: [
      {
        q: "Tour có bao gồm bảo hiểm du lịch không?",
        a: "Tất cả các tour đều bao gồm bảo hiểm du lịch với mức bồi thường lên đến 100 triệu đồng/người.",
      },
      {
        q: "Phương tiện di chuyển trong tour là gì?",
        a: "Tùy tour, chúng tôi sử dụng xe du lịch đời mới 16-45 chỗ, tàu/thuyền du lịch, và các phương tiện đặc trưng như xuồng ba lá, xe lôi.",
      },
      {
        q: "Ăn uống trong tour như thế nào?",
        a: "Tour bao gồm các bữa ăn với đặc sản miền Tây. Thực đơn được thiết kế đa dạng, đảm bảo vệ sinh an toàn thực phẩm. Có lựa chọn cho người ăn chay.",
      },
      {
        q: "Tour có phù hợp cho người lớn tuổi và trẻ em không?",
        a: "Có! Chúng tôi có các tour được thiết kế riêng cho gia đình với lịch trình nhẹ nhàng, phù hợp mọi lứa tuổi.",
      },
      {
        q: "Tôi cần chuẩn bị gì khi tham gia tour?",
        a: "Bạn nên mang theo: quần áo thoải mái, nón, kem chống nắng, thuốc chống côn trùng, máy ảnh, và tinh thần khám phá!",
      },
    ],
  },
  {
    category: "Tài khoản & Kỹ thuật",
    questions: [
      {
        q: "Tôi quên mật khẩu, phải làm sao?",
        a: "Bạn có thể nhấp vào 'Quên mật khẩu' trên trang đăng nhập và làm theo hướng dẫn để đặt lại mật khẩu qua email.",
      },
      {
        q: "Thông tin cá nhân của tôi có được bảo mật không?",
        a: "Chúng tôi cam kết bảo mật thông tin khách hàng theo chính sách bảo mật. Dữ liệu được mã hóa và không chia sẻ với bên thứ ba.",
      },
      {
        q: "Tôi có thể xem lại lịch sử đặt tour không?",
        a: "Có, sau khi đăng nhập, bạn có thể xem tất cả đơn đặt tour trong mục 'Đơn đặt tour' của tài khoản.",
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Breadcrumb
          items={[
            { label: "Trang chủ", to: "/" },
            { label: "Câu hỏi thường gặp" },
          ]}
        />
      </div>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-heading text-4xl font-bold text-slate-800 mb-4 text-center">
            Câu Hỏi Thường Gặp
          </h1>
          <p className="text-lg text-slate-600 mb-12 text-center">
            Giải đáp những thắc mắc phổ biến về dịch vụ tour du lịch miền Tây
          </p>
          {faqs.map((group, gi) => (
            <div key={gi} className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.questions.map((faq, qi) => {
                  const idx = `${gi}-${qi}`;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(idx)}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50 transition"
                      >
                        <span className="font-medium text-slate-800 pr-4">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openIndex === idx && (
                        <div className="px-4 pb-4 text-slate-600">
                          <div className="border-t pt-3">{faq.a}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="text-center mt-12 p-8 bg-river-50 rounded-xl border border-river-200">
            <h3 className="text-xl font-bold text-river-800 mb-2">
              Bạn vẫn còn thắc mắc?
            </h3>
            <p className="text-river-600 mb-4">
              Liên hệ ngay với chúng tôi để được giải đáp chi tiết.
            </p>
            <a href="/contact" className="btn-primary inline-block">
              Liên hệ ngay
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
