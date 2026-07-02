import Breadcrumb from "../components/Breadcrumb";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Breadcrumb
          items={[{ label: "Trang chủ", to: "/" }, { label: "Về chúng tôi" }]}
        />
      </div>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-heading text-4xl font-bold text-slate-800 mb-6">
            Về Du Lịch Miền Tây
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mb-12">
            Chúng tôi là đơn vị tổ chức tour du lịch miền Tây chuyên nghiệp với
            hơn 10 năm kinh nghiệm. Sứ mệnh của chúng tôi là mang đến những trải
            nghiệm sông nước miệt vườn chân thực và đáng nhớ nhất cho mọi du
            khách.
          </p>
          <div className="grid gap-12 md:grid-cols-2 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Tầm Nhìn & Sứ Mệnh
              </h2>
              <p className="text-slate-600 mb-4">
                Trở thành đơn vị tổ chức tour du lịch miền Tây hàng đầu Việt
                Nam, kết nối du khách với văn hóa sông nước, ẩm thực đặc sắc và
                con người miền Tây chân chất, hiếu khách.
              </p>
              <p className="text-slate-600">
                Chúng tôi cam kết cung cấp dịch vụ chất lượng cao, giá cả minh
                bạch và trải nghiệm du lịch bền vững, góp phần phát triển du
                lịch địa phương.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Giá Trị Cốt Lõi
              </h2>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-river-600 font-bold">✓</span> Chất lượng
                  dịch vụ là trên hết
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-river-600 font-bold">✓</span> Minh bạch
                  giá cả, không phụ phí ẩn
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-river-600 font-bold">✓</span> Hỗ trợ
                  khách hàng 24/7
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-river-600 font-bold">✓</span> Phát triển
                  du lịch bền vững
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-river-600 font-bold">✓</span> Hướng dẫn
                  viên giàu kinh nghiệm bản địa
                </li>
              </ul>
            </div>
          </div>
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="text-slate-600 max-w-3xl mb-8">
              Đội ngũ hướng dẫn viên và nhân viên của Du Lịch Miền Tây đều là
              những người con của miền sông nước, am hiểu sâu sắc văn hóa, lịch
              sử và con người nơi đây. Chúng tôi luôn nỗ lực mang đến cho du
              khách những câu chuyện thú vị và trải nghiệm chân thực nhất.
            </p>
          </div>
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Thành Tựu
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { number: "10+", label: "Năm kinh nghiệm" },
                { number: "50.000+", label: "Khách hàng hài lòng" },
                { number: "200+", label: "Tour du lịch đa dạng" },
                { number: "13", label: "Tỉnh thành miền Tây" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="text-center p-6 bg-white rounded-xl border"
                >
                  <div className="text-3xl font-bold text-river-600 mb-2">
                    {item.number}
                  </div>
                  <div className="text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Đối Tác</h2>
            <p className="text-slate-600 max-w-3xl">
              Chúng tôi hợp tác với các khách sạn, nhà hàng, và điểm tham quan
              uy tín khắp miền Tây để đảm bảo dịch vụ tốt nhất cho du khách. Các
              đối tác bao gồm: Saigontourist, Vietravel, Bến Thành Tourist và
              nhiều đơn vị địa phương khác.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
