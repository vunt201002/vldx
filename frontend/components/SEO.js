import Head from 'next/head';

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  structuredData = null
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vlxd.com';
  const fullUrl = url || siteUrl;
  const ogImage = image || `${siteUrl}/og-default.jpg`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="VLXD" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}

/**
 * Generate Product structured data for SEO
 */
export function generateProductSchema(product) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vlxd.com';

  const offers = product.variants?.map(variant => ({
    '@type': 'Offer',
    price: variant.price,
    priceCurrency: 'VND',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'VLXD'
    }
  })) || [];

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.images || [],
    brand: {
      '@type': 'Brand',
      name: 'VLXD'
    },
    offers: offers.length > 1 ? {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...product.variants.map(v => v.price)),
      highPrice: Math.max(...product.variants.map(v => v.price)),
      priceCurrency: 'VND',
      offerCount: offers.length
    } : offers[0],
    url: `${siteUrl}/products/${product.slug}`
  };
}
