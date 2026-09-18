import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import SafeImage from "../components/SafeImage";

const categories = [
  "Tất cả",
  "Chợ nổi",
  "Vườn trái cây",
  "Sông nước",
  "Ẩm thực",
  "Di tích",
  "Làng nghề",
];

const photos = [
  {
    src: "/images/gallery/floating-market-1.jpg",
    category: "Chợ nổi",
    title: "Chợ nổi Cái Răng",
  },
  {
    src: "/images/gallery/floating-market-2.jpg",
    category: "Chợ nổi",
    title: "Chợ nổi Phong Điền",
  },
  {
    src: "/images/gallery/fruit-garden-1.jpg",
    category: "Vườn trái cây",
    title: "Vườn trái cây Cái Bè",
  },
  {
    src: "/images/gallery/fruit-garden-2.jpg",
    category: "Vườn trái cây",
    title: "Vườn sầu riêng Cái Mơn",
  },
  {
    src: "/images/gallery/river-1.jpg",
    category: "Sông nước",
    title: "Sông Hậu",
  },
  {
    src: "/images/gallery/river-2.jpg",
    category: "Sông nước",
    title: "Rừng tràm Trà Sư",
  },
  {
    src: "/images/gallery/food-1.jpg",
    category: "Ẩm thực",
    title: "Bánh xèo miền Tây",
  },
  { src: "/images/gallery/food-2.jpg", category: "Ẩm thực", title: "Lẩu mắm" },
  {
    src: "/images/gallery/temple-1.jpg",
    category: "Di tích",
    title: "Chùa Som Rong",
  },
  {
    src: "/images/gallery/temple-2.jpg",
    category: "Di tích",
    title: "Lăng Ông Tiền Quân",
  },
  {
    src: "/images/gallery/craft-1.jpg",
    category: "Làng nghề",
    title: "Làng nghề làm kẹo dừa",
  },
  {
    src: "/images/gallery/craft-2.jpg",
    category: "Làng nghề",
    title: "Làng nghề dệt chiếu",
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("Tất cả");

  const filtered =
    filter === "Tất cả" ? photos : photos.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Breadcrumb
          items={[{ label: "Trang chủ", to: "/" }, { label: "Thư viện ảnh" }]}
        />
      </div>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-heading text-4xl font-bold text-slate-800 mb-4 text-center">
            Thư Viện Ảnh
          </h1>
          <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl mx-auto">
            Khám phá vẻ đẹp miền Tây qua bộ sưu tập ảnh chân thực về sông nước,
            ẩm thực và văn hóa miệt vườn
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === cat ? "bg-river-600 text-white" : "bg-white text-slate-600 border hover:bg-slate-100"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelected(photo)}
                className="group cursor-pointer relative bg-white rounded-xl border overflow-hidden hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                  <SafeImage
                    src={photo.src}
                    alt={photo.title}
                    type="gallery"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-end p-4">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                    {photo.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-4xl w-full bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="aspect-[16/10] overflow-hidden bg-slate-200">
                <SafeImage
                  src={selected.src}
                  alt={selected.title}
                  type="gallery"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 transition shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-800">
                {selected.title}
              </h3>
              <p className="text-slate-500 text-sm">{selected.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
