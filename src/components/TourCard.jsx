import { Link } from 'react-router-dom';
import { formatCurrency, TOUR_TYPES } from '../constants';

const getTourTypeLabel = (type) => {
  const typeObj = TOUR_TYPES.find(t => t.value === type);
  return typeObj ? typeObj.label : type;
};

export default function TourCard({ tour }) {
  return (
    <Link to={`/tours/${tour._id}`} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-video overflow-hidden bg-slate-200 relative">
        {tour.images?.[0] ? (
          <img src={tour.images[0]} alt={tour.name} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">Không có ảnh</div>
        )}
        {tour.isCombo && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
            Combo Liên tỉnh
          </div>
        )}
        {tour.rating > 0 && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-yellow-600 text-xs font-semibold flex items-center gap-1">
            ★ {tour.rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-river-100 px-2 py-0.5 text-xs text-river-700">
            {tour.province}
          </span>
          {tour.type && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
              {getTourTypeLabel(tour.type)}
            </span>
          )}
          {tour.featured && <span className="text-xs font-medium text-sunset-500">Nổi bật</span>}
        </div>
        <h3 className="font-heading text-lg font-semibold text-slate-800 group-hover:text-river-700">
          {tour.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {tour.description}
        </p>
        {tour.provincesVisited?.length > 1 && (
          <div className="mt-2 text-xs text-slate-500">
            📍 {tour.provincesVisited.join(' → ')}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div>
            {tour.priceAdult && tour.priceChild ? (
              <div className="text-xs text-slate-600">
              <span className="text-lg font-bold text-river-700">
                {formatCurrency(tour.priceAdult)}
              </span>
              <span className="text-slate-500"> / Người lớn</span>
              <div className="text-slate-500">
                Trẻ em: {formatCurrency(tour.priceChild)}
              </div>
            </div>
            ) : (
              <span className="text-lg font-bold text-river-700">
                {formatCurrency(tour.price)}
              </span>
            )}
          </div>
          <span className="text-sm text-slate-500">{tour.duration}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Còn {tour.availableSlots}/{tour.maxSlots} chỗ</span>
          {tour.minSlots > 1 && (
            <span>Tối thiểu {tour.minSlots} khách</span>
          )}
        </div>
      </div>
    </Link>
  );
}
