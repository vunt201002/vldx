import { useEffect } from 'react';
import ThemeLayout from '@/components/layouts/ThemeLayout';
import ProductDetail from '@/components/products/ProductDetail';
import SectionRenderer from '@/components/sections/SectionRenderer';
import SEO, { generateProductSchema } from '@/components/SEO';
import { blocksToConfig } from '@/lib/transformPageConfig';
import { trackProductView } from '@/lib/analytics';

export default function ProductDetailPage({ globalTheme, product, template }) {
  useEffect(() => {
    if (product?._id) trackProductView(product._id, product.name, `/products/${product.slug}`);
  }, [product]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vlxd.com';

  const pageMetadata = {
    title: `${product.name} - VLXD`,
    description: product.description || `Buy ${product.name} - Premium construction materials`,
    bodyClass: 'font-body bg-cream text-charcoal'
  };

  // Transform template blocks if they exist
  const topBlocksConfig = template?.topBlocks ? blocksToConfig(template.topBlocks) : null;
  const bottomBlocksConfig = template?.bottomBlocks ? blocksToConfig(template.bottomBlocks) : null;

  // Generate structured data for SEO
  const structuredData = generateProductSchema(product);

  return (
    <>
      <SEO
        title={pageMetadata.title}
        description={pageMetadata.description}
        image={product.images?.[0]}
        url={`${siteUrl}/products/${product.slug}`}
        type="product"
        structuredData={structuredData}
      />

      <ThemeLayout globalTheme={globalTheme} pageMetadata={pageMetadata}>
        {/* Optional Custom Top Blocks */}
        {topBlocksConfig && topBlocksConfig.order.length > 0 && (
          <SectionRenderer config={topBlocksConfig} />
        )}

        {/* Fixed Product Detail Section */}
        <ProductDetail product={product} />

        {/* Optional Custom Bottom Blocks */}
        {bottomBlocksConfig && bottomBlocksConfig.order.length > 0 && (
          <SectionRenderer config={bottomBlocksConfig} />
        )}
      </ThemeLayout>
    </>
  );
}

export async function getStaticPaths() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';

  try {
    const res = await fetch(`${apiBase}/products?published=true`);
    const data = await res.json();
    const products = data.data || [];

    const paths = products.map((product) => ({
      params: { slug: product.slug }
    }));

    return {
      paths,
      fallback: 'blocking' // Generate new pages on-demand
    };
  } catch (error) {
    console.error('Error generating product paths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';

  try {
    // Fetch global theme, product data, and optional template in parallel
    const [themeRes, productRes, templateRes] = await Promise.all([
      fetch(`${apiBase}/theme/active`),
      fetch(`${apiBase}/products/slug/${params.slug}`),
      fetch(`${apiBase}/theme/pages/product-template`).catch(() => null)
    ]);

    // Check if product exists
    if (!productRes.ok) {
      return { notFound: true };
    }

    const themeData = await themeRes.json();
    const productData = await productRes.json();
    const templateData = templateRes ? await templateRes.json().catch(() => null) : null;

    return {
      props: {
        globalTheme: themeData.data || null,
        product: productData.data,
        template: templateData?.data || null
      },
      revalidate: 60 // ISR: Regenerate page every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}
