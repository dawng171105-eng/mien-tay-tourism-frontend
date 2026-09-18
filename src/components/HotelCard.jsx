import { Link } from 'react-router-dom';
import { formatCurrency, SHARED_IMAGES } from '../constants';
import SafeImage from './SafeImage';

export default function HotelCard({ hotel }) {
  return (
    <Link to={`/hotels/${hotel._id}`} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-video overflow-hidden bg-slate-200">
        <SafeImage
          src={SHARED_IMAGES.hotel}
          alt={hotel.name}
          type="hotel"
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="eager"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-river-100 px-2 py-0.5 text-xs text-river-700">{hotel.province}</span>
          <div className="flex items-center gap-0.5 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < hotel.starRating ? 'text-yellow-500' : 'text-slate-300'}`}>★</span>
            ))}
          </div>
        </div>
        <h3 className="font-heading text-lg font-semibold text-slate-800 group-hover:text-river-700">{hotel.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{hotel.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-river-700">{formatCurrency(hotel.pricePerNight)}/đêm</span>
          {hotel.featured && <span className="text-xs font-medium text-sunset-500">Nổi bật</span>}
        </div>
        {hotel.amenities?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{amenity}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}