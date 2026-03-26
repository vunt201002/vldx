import ThemeLayout from '@/components/layouts/ThemeLayout';
import ProductCard from '@/components/products/ProductCard';

export default function ProductsPage({ globalTheme, products, error }) {
  if (error) {
    return (
      <ThemeLayout globalTheme={globalTheme} pageMetadata={{ title: 'Products - Error' }}>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error Loading Products</h1>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </ThemeLayout>
    );
  }

  return (
    <ThemeLayout
      globalTheme={globalTheme}
      pageMetadata={{
        title: 'Our Products - VLXD',
        description: 'Browse our collection of high-quality construction materials and products.',
        bodyClass: 'font-body bg-cream text-charcoal'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our range of premium construction materials and products
          </p>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                No Products Available
              </h3>
              <p className="mt-2 text-gray-600">
                Check back soon for new products.
              </p>
            </div>
          </div>
        )}

        {/* Product Count */}
        {products && products.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </div>
        )}
      </div>
    </ThemeLayout>
  );
}

export async function getStaticProps() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';

  try {
    const [themeRes, productsRes] = await Promise.all([
      fetch(`${apiBase}/theme/active`),
      fetch(`${apiBase}/products?published=true`)
    ]);

    const themeData = await themeRes.json();
    const productsData = await productsRes.json();

    return {
      props: {
        globalTheme: themeData.data || null,
        products: productsData.data || [],
        error: null
      },
      revalidate: 60 // ISR: Regenerate page every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching products:', error);

    return {
      props: {
        globalTheme: null,
        products: [],
        error: error.message || 'Failed to load products'
      },
      revalidate: 60
    };
  }
}
