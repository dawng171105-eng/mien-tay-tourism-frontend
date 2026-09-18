import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import Loading from '../components/Loading';
import SafeImage from '../components/SafeImage';
import { CATEGORIES, formatDate, SHARED_IMAGES } from '../constants';

export default function GuideDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/articles/${id}`)
      .then((res) => setArticle(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!article) return <p className="p-10 text-center">Bài viết không tồn tại</p>;

  const category = CATEGORIES.find((c) => c.value === article.category);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/guide" className="text-sm text-river-600 hover:underline">← Quay lại cẩm nang</Link>

      <SafeImage src={SHARED_IMAGES.guide} alt={article.title} type="article" className="mt-4 aspect-video w-full rounded-xl object-cover" loading="eager" />

      <div className="mt-6 flex gap-2">
        <span className="rounded-full bg-river-100 px-3 py-1 text-sm text-river-700">{category?.label}</span>
        <span className="rounded-full bg-sunset-400/20 px-3 py-1 text-sm text-sunset-600">{article.province}</span>
      </div>

      <h1 className="mt-4 font-heading text-4xl font-bold">{article.title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {article.author?.name} · {formatDate(article.createdAt)}
      </p>

      <div className="prose mt-8 max-w-none whitespace-pre-line text-lg leading-relaxed text-slate-700">
        {article.content}
      </div>
    </article>
  );
}
