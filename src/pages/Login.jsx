import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <div className="card w-full">
        <h1 className="font-heading text-2xl font-bold">Đăng nhập</h1>
        <p className="mt-1 text-sm text-slate-600">Chào mừng bạn quay lại Miền Tây!</p>

        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input className="input-field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
            <input className="input-field" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Chưa có tài khoản? <Link to="/register" className="text-river-600 hover:underline">Đăng ký ngay</Link>
        </p>

        {import.meta.env.DEV && (
          <div className="mt-6 rounded-lg bg-river-50 p-3 text-xs text-slate-600">
            <p><strong>Admin:</strong> admin@mientay.vn / admin123</p>
            <p><strong>Khách:</strong> customer@mientay.vn / 123456</p>
          </div>
        )}
      </div>
    </div>
  );
}
