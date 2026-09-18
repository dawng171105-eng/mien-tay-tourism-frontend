import { Link } from 'react-router-dom';
import { CATEGORIES, SHARED_IMAGES } from '../constants';
import SafeImage from './SafeImage';

export default function ArticleCard({ article }) {
  const category = CATEGORIES.find((c) => c.value === article.category);

  return (
    <Link to={`/guide/${article._id}`} className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-video overflow-hidden bg-slate-200">
        <SafeImage
          src={SHARED_IMAGES.guide}
          alt={article.title}
          type="article"
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="eager"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex gap-2">
          <span className="rounded-full bg-river-100 px-2 py-0.5 text-xs text-river-700">{category?.label}</span>
          <span className="rounded-full bg-sunset-400/20 px-2 py-0.5 text-xs text-sunset-600">{article.province}</span>
        </div>
        <h3 className="font-heading text-lg font-semibold text-slate-800 group-hover:text-river-700">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{article.content}</p>
      </div>
    </Link>
  );
}
