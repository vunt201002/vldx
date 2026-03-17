import Head from 'next/head';
import Link from 'next/link';
import { get } from '../../lib/api';

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

export async function getStaticPaths() {
  try {
    const res = await get('/materials?limit=50');
    const paths = (res.data || []).map((m) => ({
      params: { id: m._id },
    }));
    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const res = await get(`/materials/${params.id}`);
    if (!res.data) return { notFound: true };
    return {
      props: { material: res.data },
      revalidate: 60,
    };
  } catch {
    return { notFound: true };
  }
}

export default function MaterialDetail({ material }) {
  const specs = material.specs || {};
  const specEntries = Object.entries(specs);

  return (
    <>
      <Head>
        <title>{material.name} - VLXD</title>
        <meta name="description" content={material.description || material.name} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
              &larr; Trang chu
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-700">{material.name}</span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Image */}
            <div className="h-64 md:h-80 bg-gray-100 flex items-center justify-center">
              {material.images && material.images.length > 0 ? (
                <img
                  src={material.images[0]}
                  alt={material.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-6xl">
                  {CATEGORY_LABELS[material.category]?.[0] || '?'}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {CATEGORY_LABELS[material.category] || material.category}
              </span>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                {material.name}
              </h1>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-semibold text-gray-900">
                  {formatPrice(material.price)}
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    material.inStock
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {material.inStock ? 'Con hang' : 'Het hang'}
                </span>
              </div>

              {material.description && (
                <p className="text-gray-600 mt-6 leading-relaxed">
                  {material.description}
                </p>
              )}

              {/* Specs */}
              {specEntries.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Thong so ky thuat
                  </h2>
                  <dl className="grid grid-cols-2 gap-2">
                    {specEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between bg-gray-50 rounded px-3 py-2"
                      >
                        <dt className="text-sm text-gray-500">{key}</dt>
                        <dd className="text-sm font-medium text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
