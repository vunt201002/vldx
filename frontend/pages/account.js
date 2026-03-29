import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import { get, post } from '@/lib/api';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();

  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthday: '',
    profilePicture: '',
  });
  const [favorites, setFavorites] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fill form with user data
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  // Fetch favorites
  useEffect(() => {
    if (isAuthenticated && tab === 'favorites') {
      fetchFavorites();
    }
  }, [isAuthenticated, tab]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/auth/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setFavorites(data.data || []);
    } catch {
      setFavorites([]);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'customers');
      const res = await fetch('/api/upload/customer', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setForm((prev) => ({ ...prev, profilePicture: data.data.url }));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(form);
      setMessage({ type: 'success', text: 'Cap nhat thanh cong!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Cap nhat that bai' });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(`/api/auth/favorites/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setFavorites((prev) => prev.filter((p) => p._id !== productId));
    } catch {}
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tai khoan - VLXD</title>
      </Head>

      <div className="min-h-screen bg-cream">
        {/* Header */}
        <div className="bg-charcoal text-cream">
          <div className="mx-auto max-w-3xl px-4 py-10">
            <Link href="/landing" className="text-sm text-cream/60 hover:text-cream transition">
              ← Trang chu
            </Link>
            <div className="mt-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="relative group">
                {form.profilePicture ? (
                  <img
                    src={form.profilePicture}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full object-cover border-2 border-cream/30"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/20 text-2xl font-bold text-cream">
                    {(user?.firstName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition">
                  <span className="hidden group-hover:block text-xs text-white font-medium">
                    {uploading ? '...' : 'Doi'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-light">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-sm text-cream/60">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex gap-0 border-b border-charcoal/10 -mt-px">
            {[
              { key: 'profile', label: 'Thong tin' },
              { key: 'favorites', label: 'Yeu thich' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
                  tab === t.key
                    ? 'border-charcoal text-charcoal'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal/70'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Message */}
          {message && (
            <div className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {tab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Ho</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Ten</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">So dien thoai</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0912 345 678"
                  className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Ngay sinh</label>
                <input
                  name="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition focus:border-charcoal/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/70 mb-1.5">Email</label>
                <input
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-lg border border-charcoal/10 bg-charcoal/5 px-4 py-2.5 text-sm text-charcoal/50 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-charcoal px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-charcoal/90 disabled:opacity-50"
                >
                  {saving ? 'Dang luu...' : 'Luu thay doi'}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-charcoal/20 px-6 py-2.5 text-sm font-medium text-charcoal/60 transition hover:bg-charcoal/5"
                >
                  Dang xuat
                </button>
              </div>
            </form>
          )}

          {tab === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-charcoal/50">Chua co san pham yeu thich nao</p>
                  <Link href="/products" className="mt-3 inline-block text-sm font-medium text-charcoal underline">
                    Kham pha san pham
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {favorites.map((product) => (
                    <div
                      key={product._id}
                      className="group flex overflow-hidden rounded-lg border border-charcoal/10 bg-white transition hover:shadow-md"
                    >
                      {product.images?.[0] && (
                        <div className="h-28 w-28 flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col justify-between p-3">
                        <div>
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-sm font-semibold text-charcoal hover:underline"
                          >
                            {product.name}
                          </Link>
                          {product.price && (
                            <p className="mt-0.5 text-xs text-charcoal/50">
                              {product.price.toLocaleString('vi-VN')} d
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(product._id)}
                          className="self-start mt-1 text-xs text-red-500 hover:text-red-700 transition"
                        >
                          Bo yeu thich
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
