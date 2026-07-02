import { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { CATEGORIES, PROVINCES } from '../../constants';

const emptyForm = {
  title: '',
  content: '',
  province: 'Cần Thơ',
  category: 'kinh-nghiem',
  coverImage: '',
  published: true,
};

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    setLoading(true);
    api
      .get('/articles/admin/all')
      .then((res) => setArticles(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEdit(article) {
    setForm({
      title: article.title,
      content: article.content,
      province: article.province,
      category: article.category,
      coverImage: article.coverImage || '',
      published: article.published,
    });
    setEditingId(article._id);
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await api.put(`/articles/${editingId}`, form);
    } else {
      await api.post('/articles', form);
    }
    resetForm();
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Xóa bài viết này?')) return;
    await api.delete(`/articles/${id}`);
    load();
  }

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Quản lý bài viết</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Thêm bài viết</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
          <h2 className="font-semibold">{editingId ? 'Chỉnh sửa' : 'Thêm mới'} bài viết</h2>
          <input className="input-field" placeholder="Tiêu đề" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="input-field" rows="5" placeholder="Nội dung" required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-3">
            <select className="input-field" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input className="input-field" placeholder="URL ảnh bìa" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Xuất bản
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Lưu</button>
            <button type="button" className="btn-secondary" onClick={resetForm}>Hủy</button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="pb-2">Tiêu đề</th>
              <th className="pb-2">Tỉnh</th>
              <th className="pb-2">Danh mục</th>
              <th className="pb-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a._id} className="border-b">
                <td className="py-3">{a.title}</td>
                <td className="py-3">{a.province}</td>
                <td className="py-3">{CATEGORIES.find((c) => c.value === a.category)?.label}</td>
                <td className="py-3">
                  <button className="mr-2 text-river-600 hover:underline" onClick={() => startEdit(a)}>Sửa</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(a._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
