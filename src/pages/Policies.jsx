import Breadcrumb from "../components/Breadcrumb";

export default function Policies() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Breadcrumb
          items={[
            { label: "Trang chủ", to: "/" },
            { label: "Chính sách & Điều khoản" },
          ]}
        />
      </div>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-heading text-4xl font-bold text-slate-800 mb-8">
            Chính Sách & Điều Khoản
          </h1>
          <div className="space-y-10">
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                1. Chính Sách Hủy Tour
              </h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  Chúng tôi hiểu rằng kế hoạch có thể thay đổi. Dưới đây là
                  chính sách hủy tour chi tiết:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Hủy trước 7 ngày:</strong> Hoàn 100% giá trị tour
                  </li>
                  <li>
                    <strong>Hủy trước 3-6 ngày:</strong> Hoàn 70% giá trị tour
                  </li>
                  <li>
                    <strong>Hủy trước 1-2 ngày:</strong> Hoàn 50% giá trị tour
                  </li>
                  <li>
                    <strong>Hủy trong ngày khởi hành:</strong> Không hoàn tiền
                  </li>
                  <li>
                    <strong>Tour bị hủy do thời tiết/thiên tai:</strong> Hoàn
                    100% hoặc đổi lịch miễn phí
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                2. Chính Sách Đổi Lịch
              </h2>
              <div className="text-slate-600 space-y-3">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Đổi lịch miễn phí trước 3 ngày khởi hành</li>
                  <li>Đổi lịch trong vòng 1-2 ngày: phí 10% giá trị tour</li>
                  <li>Chỉ được đổi lịch 1 lần/booking</li>
                  <li>
                    Lịch mới phải trong vòng 30 ngày kể từ ngày khởi hành ban
                    đầu
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                3. Bảo Hiểm Du Lịch
              </h2>
              <p className="text-slate-600">
                Tất cả khách hàng tham gia tour đều được bảo hiểm du lịch với
                mức bồi thường tối đa 100 triệu đồng/người/vụ. Bảo hiểm bao gồm:
                tai nạn cá nhân, chi phí y tế, mất hành lý, hủy/chậm chuyến đi.
              </p>
            </div>
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                4. Chính Sách Thanh Toán
              </h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  <strong>Phương thức thanh toán:</strong> Chuyển khoản ngân
                  hàng, thẻ Visa/Mastercard, Momo, ZaloPay, tiền mặt tại văn
                  phòng.
                </p>
                <p>
                  <strong>Tiến độ thanh toán:</strong> Đặt cọc 30% khi đặt tour,
                  thanh toán 70% còn lại trước ngày khởi hành 3 ngày.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                5. Chính Sách Bảo Mật
              </h2>
              <div className="text-slate-600 space-y-3">
                <p>
                  Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của
                  khách hàng:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Dữ liệu được mã hóa theo chuẩn SSL/TLS</li>
                  <li>
                    Không chia sẻ thông tin với bên thứ ba khi chưa có sự đồng ý
                  </li>
                  <li>
                    Khách hàng có quyền yêu cầu xóa dữ liệu cá nhân bất kỳ lúc
                    nào
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                6. Điều Khoản Chung
              </h2>
              <div className="text-slate-600 space-y-3">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Khách hàng cần cung cấp thông tin chính xác khi đặt tour
                  </li>
                  <li>
                    Trẻ em dưới 5 tuổi miễn phí (ngủ chung giường với phụ huynh)
                  </li>
                  <li>Trẻ em 5-10 tuổi tính 50% giá tour</li>
                  <li>
                    Mọi khiếu nại cần được gửi trong vòng 7 ngày sau khi kết
                    thúc tour
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
