import { useEffect, useMemo, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import { PROVINCES, formatCurrency } from '../../constants';

const PAGE_SIZE = 15;

const emptyForm = {
  name: '',
  description: '',
  itinerary: '',
  province: 'Cần Thơ',
  price: '',
  duration: '1 ngày',
  maxSlots: 30,
  availableSlots: 30,
  images: '',
  departures: '',
  featured: false,
  active: true,
};

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  function load() {
    setLoading(true);
    api
      .get('/tours/admin/all')
      .then((res) => setTours(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tours;
    return tours.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.province?.toLowerCase().includes(q)
    );
  }, [tours, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function startEdit(tour) {
    setForm({
      name: tour.name,
      description: tour.description,
      itinerary: tour.itinerary,
      province: tour.province,
      price: tour.price,
      duration: tour.duration,
      maxSlots: tour.maxSlots,
      availableSlots: tour.availableSlots,
      images: tour.images?.join(', ') || '',
      departures: tour.departures?.map((d) => d.slice(0, 10)).join(', ') || '',
      featured: tour.featured,
      active: tour.active,
    });
    setEditingId(tour._id);
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      maxSlots: Number(form.maxSlots),
      availableSlots: Number(form.availableSlots),
      images: form.images ? form.images.split(',').map((s) => s.trim()) : [],
      departures: form.departures
        ? form.departures.split(',').map((s) => new Date(s.trim()))
        : [],
    };

    if (editingId) {
      await api.put(`/tours/${editingId}`, payload);
    } else {
      await api.post('/tours', payload);
    }
    resetForm();
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Xóa tour này?')) return;
    await api.delete(`/tours/${id}`);
    load();
  }

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-bold">Quản lý tour</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Thêm tour</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
          <h2 className="font-semibold">{editingId ? 'Chỉnh sửa' : 'Thêm mới'} tour</h2>
          <input className="input-field" placeholder="Tên tour" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="input-field" rows="2" placeholder="Mô tả" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="input-field" rows="3" placeholder="Lịch trình" required value={form.itinerary} onChange={(e) => setForm({ ...form, itinerary: e.target.value })} />
          <div className="grid gap-4 md:grid-cols-3">
            <select className="input-field" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input className="input-field" type="number" placeholder="Giá" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input-field" placeholder="Thời lượng" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input-field" type="number" placeholder="Số chỗ tối đa" value={form.maxSlots} onChange={(e) => setForm({ ...form, maxSlots: e.target.value })} />
            <input className="input-field" type="number" placeholder="Số chỗ còn" value={form.availableSlots} onChange={(e) => setForm({ ...form, availableSlots: e.target.value })} />
          </div>
          <input className="input-field" placeholder="URL ảnh (phân cách bằng dấu phẩy)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          <input className="input-field" placeholder="Ngày khởi hành (YYYY-MM-DD, phân cách bằng dấu phẩy)" value={form.departures} onChange={(e) => setForm({ ...form, departures: e.target.value })} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Hoạt động
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Lưu</button>
            <button type="button" className="btn-secondary" onClick={resetForm}>Hủy</button>
          </div>
        </form>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="input-field sm:max-w-xs"
          placeholder="Tìm theo tên hoặc tỉnh..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <p className="text-sm text-slate-500">{filtered.length} tour</p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="pb-2">Tên tour</th>
              <th className="pb-2">Tỉnh</th>
              <th className="pb-2">Giá</th>
              <th className="pb-2">Chỗ</th>
              <th className="pb-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((t) => (
              <tr key={t._id} className="border-b">
                <td className="py-3">{t.name}</td>
                <td className="py-3">{t.province}</td>
                <td className="py-3">{formatCurrency(t.price)}</td>
                <td className="py-3">{t.availableSlots}/{t.maxSlots}</td>
                <td className="py-3">
                  <button className="mr-2 text-river-600 hover:underline" onClick={() => startEdit(t)}>Sửa</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(t._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">
            Không tìm thấy tour phù hợp
          </p>
        )}
      </div>

      <Pagination page={currentPage} pages={pages} onChange={setPage} className="mt-6" />
    </div>
  );
}
