import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = router.query.redirect || '/profile';
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const redirect = router.query.redirect || '/profile';
      router.push(redirect);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-charcoal mb-2">
            bê tông <span className="font-normal">việt</span>
          </h1>
          <p className="text-charcoal/70">đăng nhập tài khoản</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-charcoal/70 hover:text-charcoal transition"
              >
                quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-charcoal/50">hoặc</span>
            </div>
          </div>

          {/* Google Login - Placeholder */}
          <div className="text-center text-sm text-charcoal/50">
            Đăng nhập Google sẽ có sẵn sớm
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-charcoal/70">chưa có tài khoản? </span>
            <Link href="/register" className="text-charcoal font-medium hover:underline">
              đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/landing" className="text-sm text-charcoal/70 hover:text-charcoal transition">
            ← về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
