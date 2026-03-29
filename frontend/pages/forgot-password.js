import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Gửi yêu cầu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light text-charcoal mb-2">Kiểm tra email của bạn</h2>
            <p className="text-charcoal/70 mb-2">
              Nếu tài khoản tồn tại, chúng tôi đã gửi link đặt lại mật khẩu đến:
            </p>
            <p className="font-medium text-charcoal mb-6">{email}</p>
            <p className="text-sm text-charcoal/60 mb-6">
              Link sẽ hết hạn sau 1 giờ. Kiểm tra cả thư mục spam nếu không thấy email.
            </p>
            <Link
              href="/login"
              className="inline-block text-sm text-charcoal hover:underline"
            >
              ← quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-charcoal mb-2">quên mật khẩu?</h1>
          <p className="text-charcoal/70">nhập email để nhận link đặt lại mật khẩu</p>
        </div>

        {/* Form */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-charcoal/70 hover:text-charcoal transition">
              ← quay lại đăng nhập
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
