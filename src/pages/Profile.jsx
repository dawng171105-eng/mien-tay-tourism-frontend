import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await updateProfile(form);
      setMessage('Cập nhật hồ sơ thành công!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-heading text-3xl font-bold">Hồ sơ cá nhân</h1>

      <div className="card mt-6">
        <p className="text-sm text-slate-500">Email: {user?.email}</p>
        <p className="text-sm text-slate-500">Vai trò: {user?.role === 'admin' ? 'Quản trị viên' : 'Khách du lịch'}</p>

        {message && <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Họ tên</label>
            <input className="input-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Số điện thoại</label>
            <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}
