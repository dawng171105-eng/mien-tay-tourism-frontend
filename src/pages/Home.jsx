import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import ArticleCard from "../components/ArticleCard";
import TourCard from "../components/TourCard";
import HotelCard from "../components/HotelCard";
import Loading from "../components/Loading";

export default function Home() {
  const [tours, setTours] = useState([]);
  const [articles, setArticles] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("API Base URL:", import.meta.env.VITE_API_URL);
    Promise.all([
      api.get("/tours?featured=true"),
      api.get("/articles"),
      api.get("/hotels?featured=true"),
    ])
      .then(([toursRes, articlesRes, hotelsRes]) => {
        console.log("Tours:", toursRes.data);
        console.log("Articles:", articlesRes.data);
        console.log("Hotels:", hotelsRes.data);
        setTours(toursRes.data.slice(0, 3));
        setArticles(articlesRes.data.slice(0, 3));
        setHotels(hotelsRes.data.slice(0, 3));
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        alert("Error loading data: " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const promotions = [
    {
      icon: "🎉",
      title: "Giảm giá 15%",
      desc: "Giảm ngay 15% cho tour đầu tiên khi đăng ký thành viên",
      badge: "MỚI",
      color: "bg-red-500",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Ưu đãi gia đình",
      desc: "Miễn phí 1 vé trẻ em khi đặt tour cho 4 người lớn",
      badge: "HOT",
      color: "bg-orange-500",
    },
    {
      icon: "💳",
      title: "Thanh toán linh hoạt",
      desc: "Trả góp 0% hoặc thanh toán nhiều đợt không phát sinh phí",
      badge: "NEW",
      color: "bg-blue-500",
    },
  ];

  const customerBenefits = [
    {
      icon: "🔄",
      title: "Hủy tour miễn phí",
      desc: "Hủy miễn phí trong vòng 72 giờ trước khi khởi hành",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: "💰",
      title: "Cam kết giá tốt nhất",
      desc: "Hoàn trả chênh lệch nếu tìm được giá rẻ hơn",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: "📞",
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ hỗ trợ khách hàng luôn sẵn sàng phục vụ",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: "🛡️",
      title: "Bảo hiểm du lịch",
      desc: "Bảo hiểm toàn diện cho mọi chuyến đi của bạn",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: "✅",
      title: "Chất lượng đảm bảo",
      desc: "100% tour được kiểm tra và đảm bảo chất lượng",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: "🎁",
      title: "Quà tặng hấp dẫn",
      desc: "Nhận quà tặng giá trị khi đặt tour dài ngày",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  const whyChooseUs = [
    {
      icon: "🛶",
      title: "Trải nghiệm sông nước",
      desc: "Tour chợ nổi, xuồng ba lá, miệt vườn trái cây",
    },
    {
      icon: "🍲",
      title: "Ẩm thực đặc sản",
      desc: "Lẩu mắm, hủ tiếu, bánh pía và nhiều món ngon",
    },
    {
      icon: "🏨",
      title: "Khách sạn chất lượng",
      desc: "Lựa chọn khách sạn 3-5 sao tiện nghi",
    },
    {
      icon: "👨‍✈️",
      title: "Hướng dẫn viên chuyên nghiệp",
      desc: "Đội ngũ hướng dẫn viên giàu kinh nghiệm",
    },
    {
      icon: "🚍",
      title: "Phương tiện hiện đại",
      desc: "Xe ô tô mới, xe máy, thuyền du lịch cao cấp",
    },
    {
      icon: "📱",
      title: "Đặt tour trực tuyến",
      desc: "Đặt tour nhanh chóng, theo dõi trạng thái đơn hàng",
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-river-800 via-river-700 to-river-900 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <h1 className="font-heading text-4xl font-bold md:text-6xl">
            Khám phá Miền Tây sông nước
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-river-100">
            Trải nghiệm chợ nổi, vườn trái cây, ẩm thực đặc sản và văn hóa độc
            đáo vùng Đồng bằng sông Cửu Long.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/tours"
              className="rounded-lg bg-sunset-500 px-6 py-3 font-medium text-white hover:bg-sunset-600"
            >
              Xem tour du lịch
            </Link>
            <Link
              to="/guide"
              className="rounded-lg border border-white/50 px-6 py-3 font-medium hover:bg-white/10"
            >
              Đọc cẩm nang
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Section */}
      <section className="bg-gradient-to-r from-sunset-50 to-orange-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-slate-800">
              Ưu đãi đặc biệt
            </h2>
            <p className="mt-2 text-slate-600">
              Những ưu đãi hấp dẫn chỉ dành cho khách hàng của chúng tôi
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {promotions.map((promo) => (
              <div
                key={promo.title}
                className="card relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div
                  className={`absolute top-4 right-4 ${promo.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
                >
                  {promo.badge}
                </div>
                <div className="text-5xl mb-4">{promo.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {promo.title}
                </h3>
                <p className="text-slate-600">{promo.desc}</p>
                <div className="mt-4">
                  <Link
                    to="/tours"
                    className="text-sunset-600 font-semibold hover:text-sunset-700 inline-flex items-center gap-1"
                  >
                    Khám phá ngay →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold text-slate-800">
            Tour nổi bật
          </h2>
          <Link to="/tours" className="text-river-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="bg-river-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold text-slate-800">
              Khách sạn nổi bật
            </h2>
            <Link to="/hotels" className="text-river-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Benefits */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-slate-800">
              Chính sách khách hàng
            </h2>
            <p className="mt-2 text-slate-600">
              An tâm và hài lòng với mọi chuyến đi
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {customerBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="card flex gap-4 items-start hover:shadow-lg transition-shadow"
              >
                <div
                  className={`${benefit.bgColor} ${benefit.color} p-4 rounded-full text-2xl flex-shrink-0`}
                >
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-river-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold text-slate-800">
              Cẩm nang du lịch
            </h2>
            <Link to="/guide" className="text-river-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-center font-heading text-3xl font-bold">
          Tại sao chọn chúng tôi?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="card text-center">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
