import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function ProfileContent() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(profileData);
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }

    setLoading(true);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      // User will be logged out automatically after password change
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu thất bại');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-charcoal/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-charcoal">
                Xin chào, {user?.firstName}!
              </h1>
              <p className="text-charcoal/70 text-sm mt-1">{user?.email}</p>
            </div>
            <Link href="/landing" className="text-sm text-charcoal/70 hover:text-charcoal transition">
              ← về trang chủ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-charcoal/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-1 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-charcoal text-charcoal'
                : 'border-transparent text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-3 px-1 border-b-2 transition ${
              activeTab === 'password'
                ? 'border-charcoal text-charcoal'
                : 'border-transparent text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8">
            <h2 className="text-xl font-light text-charcoal mb-6">Thông tin cá nhân</h2>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm">
                  {success}
                </div>
              )}

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-md bg-gray-50 text-charcoal/50 cursor-not-allowed"
                />
                <p className="text-xs text-charcoal/60 mt-1">Email không thể thay đổi</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-2">
                    Tên
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-charcoal mb-2">
                    Họ
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                  Số điện thoại (tùy chọn)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                  placeholder="+84 xxx xxx xxx"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>

            {/* Account Info */}
            <div className="mt-8 pt-6 border-t border-charcoal/10">
              <h3 className="text-sm font-medium text-charcoal mb-3">Thông tin tài khoản</h3>
              <div className="space-y-2 text-sm text-charcoal/70">
                <p>
                  <span className="font-medium">Trạng thái email:</span>{' '}
                  {user?.isEmailVerified ? (
                    <span className="text-green-600">Đã xác nhận</span>
                  ) : (
                    <span className="text-yellow-600">Chưa xác nhận</span>
                  )}
                </p>
                <p>
                  <span className="font-medium">Ngày tạo:</span>{' '}
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-charcoal/10">
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8">
            <h2 className="text-xl font-light text-charcoal mb-6">Đổi mật khẩu</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-charcoal mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-charcoal mb-2">
                  Mật khẩu mới
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <p className="text-xs text-charcoal/60 mt-2">
                  Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm">
                ⚠️ Sau khi đổi mật khẩu, bạn sẽ được đăng xuất và cần đăng nhập lại.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
