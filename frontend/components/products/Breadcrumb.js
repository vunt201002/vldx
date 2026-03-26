import Link from 'next/link';

export default function Breadcrumb({ items = [] }) {
  // Default breadcrumb if no items provided
  const breadcrumbItems = items.length > 0 ? items : [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' }
  ];

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {!isLast ? (
                <>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-sandstone transition-colors"
                  >
                    {item.label}
                  </Link>
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                <span className="font-medium text-gray-900">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
