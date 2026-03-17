import Head from 'next/head';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';

const CATEGORY_LABELS = {
  'xi-mang': 'Xi Mang',
  'gach': 'Gach',
  'cat-son': 'Cat & Son',
  'thep': 'Thep',
  'da': 'Da',
  'cat': 'Cat',
  'ong-nuoc': 'Ong Nuoc',
  'vat-lieu-khac': 'Khac',
};

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export default function Home() {
  const { data, loading, error } = useFetch('/materials?limit=20');
  const materials = data?.data || [];
  return (
    <>
      <Head>
        <title>VLXD - Vat Lieu Xay Dung</title>
        <meta name="description" content="Cung cap vat lieu xay dung chat luong cao" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">VLXD</h1>
            <p className="text-gray-600 mt-1">Vat Lieu Xay Dung</p>
          </div>
        </header>

        {/* Materials Grid */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Dang tai...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">Loi: {error}</p>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Chua co san pham nao.</p>
              <p className="text-gray-400 text-sm mt-2">
                Chay seed script de them du lieu mau.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                San pham ({materials.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {materials.map((material) => (
                  <Link
                    key={material._id}
                    href={`/materials/${material._id}`}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Placeholder image */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      {material.images && material.images.length > 0 ? (
                        <img
                          src={material.images[0]}
                          alt={material.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-4xl">
                          {CATEGORY_LABELS[material.category]?.[0] || '?'}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {CATEGORY_LABELS[material.category] || material.category}
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 mt-1 line-clamp-2">
                        {material.name}
                      </h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-base font-semibold text-gray-900">
                          {formatPrice(material.price)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            material.inStock
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {material.inStock ? 'Con hang' : 'Het hang'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
