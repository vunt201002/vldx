import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Extract token from URL
  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token);
    }
  }, [router.query.token]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 2) setPasswordStrength('weak');
    else if (strength < 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);

  const validateForm = () => {
    if (!token) {
      setError('Invalid token');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least 1 uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least 1 lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least 1 number');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light text-charcoal mb-2">Password Reset Successful!</h2>
            <p className="text-charcoal/70 mb-6">
              You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-block bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition"
            >
              Go to Login
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
          <h1 className="text-3xl font-light text-charcoal mb-2">Reset Password</h1>
          <p className="text-charcoal/70">enter your new password</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                New Password *
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
              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === 'weak'
                          ? 'bg-red-500'
                          : passwordStrength === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === 'medium' || passwordStrength === 'strong'
                          ? passwordStrength === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  </div>
                  <p className="text-xs text-charcoal/60 mt-1">
                    {passwordStrength === 'weak' && 'Weak'}
                    {passwordStrength === 'medium' && 'Medium'}
                    {passwordStrength === 'strong' && 'Strong'}
                  </p>
                </div>
              )}
              <p className="text-xs text-charcoal/60 mt-2">
                Minimum 8 characters, including uppercase, lowercase and numbers
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-charcoal/50 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-charcoal/70 hover:text-charcoal transition">
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/landing" className="text-sm text-charcoal/70 hover:text-charcoal transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
