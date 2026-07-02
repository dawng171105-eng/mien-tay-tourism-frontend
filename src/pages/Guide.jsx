import { useEffect, useState } from 'react';
import api from '../api/api';
import ArticleCard from '../components/ArticleCard';
import Loading from '../components/Loading';
import { CATEGORIES, PROVINCES } from '../constants';

export default function Guide() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ province: '', category: '', search: '' });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.province) params.set('province', filters.province);
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);

    api
      .get(`/articles?${params}`)
      .then((res) => setArticles(res.data))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold">Cẩm nang du lịch Miền Tây</h1>
      <p className="mt-2 text-slate-600">Khám phá địa danh, ẩm thực và lễ hội theo từng tỉnh thành</p>

      <div className="mt-6 grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-4">
        <input
          className="input-field md:col-span-2"
          placeholder="Tìm kiếm bài viết..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select className="input-field" value={filters.province} onChange={(e) => setFilters({ ...filters, province: e.target.value })}>
          <option value="">Tất cả tỉnh</option>
          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input-field" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">Tất cả danh mục</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : articles.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">Không tìm thấy bài viết phù hợp</p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.map((article) => <ArticleCard key={article._id} article={article} />)}
        </div>
      )}
    </div>
  );
}
