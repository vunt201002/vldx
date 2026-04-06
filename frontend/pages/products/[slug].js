import { useEffect } from 'react';
import ThemeLayout from '@/components/layouts/ThemeLayout';
import ProductDetail from '@/components/products/ProductDetail';
import SectionRenderer from '@/components/sections/SectionRenderer';
import SEO, { generateProductSchema } from '@/components/SEO';
import { blocksToConfig } from '@/lib/transformPageConfig';
import { trackProductView } from '@/lib/analytics';
import { fetchStaticData, fetchThemeData } from '@/lib/fetchPageData';

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
  try {
    const productsData = await fetchStaticData('products.json', '/products?published=true');
    const products = productsData?.data || [];

    return {
      paths: products.map((product) => ({ params: { slug: product.slug } })),
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error generating product paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const [globalTheme, productData, templateData] = await Promise.all([
      fetchThemeData(),
      fetchStaticData(`products/${params.slug}.json`, `/products/slug/${params.slug}`),
      fetchStaticData(`pages/product-template.json`, `/theme/pages/product-template`).catch(() => null),
    ]);

    if (!productData?.data) return { notFound: true };

    return {
      props: {
        globalTheme,
        product: productData.data,
        template: templateData?.data || null,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}
