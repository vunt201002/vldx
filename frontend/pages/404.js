import Link from 'next/link';
import { fetchGlobalTheme } from '@/lib/fetchPageWithTheme';
import ThemeLayout from '@/components/layouts/ThemeLayout';

export default function Custom404({ globalTheme }) {
  return (
    <ThemeLayout
      globalTheme={globalTheme}
      pageMetadata={{
        title: 'Page Not Found - 404',
        description: 'The page you are looking for does not exist.',
        bodyClass: 'font-body bg-cream text-charcoal'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          {/* 404 Icon */}
          <div className="mb-8">
            <svg
              className="mx-auto h-32 w-32 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page may have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-sandstone px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-concrete focus:outline-none focus:ring-2 focus:ring-sandstone focus:ring-offset-2"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border-2 border-sandstone bg-white px-6 py-3 text-base font-semibold text-sandstone transition-colors hover:bg-sand focus:outline-none focus:ring-2 focus:ring-sandstone focus:ring-offset-2"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </ThemeLayout>
  );
}

export async function getStaticProps() {
  const { globalTheme } = await fetchGlobalTheme();

  return {
    props: {
      globalTheme: globalTheme || null
    }
  };
}
