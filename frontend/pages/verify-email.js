import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    const { token } = router.query;

    if (token) {
      handleVerification(token);
    }
  }, [router.query]);

  const handleVerification = async (token) => {
    try {
      await verifyEmail(token);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Email verification failed');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-charcoal mb-4"></div>
          <h2 className="text-2xl font-light text-charcoal mb-2">Verifying email...</h2>
          <p className="text-charcoal/70">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light text-charcoal mb-2">Email Verified!</h2>
            <p className="text-charcoal/70 mb-6">
              Your account has been activated. You can now sign in.
            </p>
            <Link
              href="/login"
              className="inline-block bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition"
            >
              Go to Login
            </Link>
          </div>
          <div className="mt-6 text-center">
            <Link href="/landing" className="text-sm text-charcoal/70 hover:text-charcoal transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-light text-charcoal mb-2">Verification Failed</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <p className="text-charcoal/70 text-sm mb-6">
              The verification link may have expired or is invalid.
            </p>
            <div className="space-x-4">
              <Link
                href="/login"
                className="inline-block bg-charcoal text-cream py-3 px-6 rounded-md hover:bg-charcoal/90 transition"
              >
                Go to Login
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/landing" className="text-sm text-charcoal/70 hover:text-charcoal transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
