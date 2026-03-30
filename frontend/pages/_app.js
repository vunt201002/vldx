import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import { trackPageView } from '@/lib/analytics';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Track every page navigation automatically
  useEffect(() => {
    // Track initial page load
    trackPageView(router.asPath);

    // Track client-side navigations
    const handleRouteChange = (url) => trackPageView(url);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
