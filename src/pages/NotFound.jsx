import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🏞️</div>
        <h1 className="font-heading text-6xl font-bold text-slate-800 mb-4">
          404
        </h1>
        <h2 className="text-2xl text-slate-600 mb-6">
          Trang bạn tìm không tồn tại
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Có vẻ như bạn đã lạc vào một nhánh sông không có trên bản đồ. Hãy để
          chúng tôi đưa bạn trở lại đất liền!
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
          <Link to="/tours" className="btn-secondary">
            Xem tour du lịch
          </Link>
        </div>
      </div>
    </div>
  );
}
