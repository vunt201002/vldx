/**
 * Migration: Migrate Product Pages to Products
 *
 * This script:
 * 1. Identifies product pages (tam-op-cau-thang, gach-op-lat, etc.)
 * 2. Extracts product information from page blocks
 * 3. Creates Product documents with extracted data
 * 4. Marks old pages as archived (unpublished) but doesn't delete them yet
 */

import mongoose from 'mongoose';
import Page from '../models/Page';
import Product from '../models/Product';
import { connectDB } from '../config/database';

interface ProductPageData {
  slug: string;
  name: string;
  description: string;
  heroImage?: string;
  variants: Array<{
    name: string;
    image?: string;
    description?: string;
    specs?: string;
  }>;
  colors: Array<{
    name: string;
    hex: string;
    image?: string;
  }>;
}

async function extractProductData(page: any): Promise<ProductPageData> {
  const productData: ProductPageData = {
    slug: page.slug,
    name: page.title,
    description: page.description || '',
    variants: [],
    colors: [],
  };

  // Find material-showcase block for variants
  const materialShowcase = page.blocks.find((pb: any) => {
    const block = pb.block;
    return block && block.type === 'material-showcase';
  });

  if (materialShowcase && materialShowcase.block.data) {
    const data = materialShowcase.block.data;

    // Extract description from material-showcase
    if (data.description) {
      productData.description = data.description;
    }

    // Extract variants
    if (data.variants && Array.isArray(data.variants)) {
      productData.variants = data.variants.map((v: any, index: number) => ({
        name: v.name || `Variant ${index + 1}`,
        sku: `${page.slug}-${index + 1}`,
        price: 0, // Default price, will need to be updated manually
        image: v.image,
        description: v.description,
        specs: v.specs,
      }));
    }
  }

  // Find color-picker block for colors
  const colorPicker = page.blocks.find((pb: any) => {
    const block = pb.block;
    return block && block.type === 'color-picker';
  });

  if (colorPicker && colorPicker.block.data) {
    const data = colorPicker.block.data;

    // Extract colors
    if (data.colors && Array.isArray(data.colors)) {
      productData.colors = data.colors.map((c: any) => ({
        name: c.name || c.label || 'Unknown',
        hex: c.hex || c.color || '#000000',
        image: c.image || '',
      }));
    }
  }

  // Find hero block for main image
  const hero = page.blocks.find((pb: any) => {
    const block = pb.block;
    return block && block.type === 'hero';
  });

  if (hero && hero.block.data && hero.block.data.imageUrl) {
    productData.heroImage = hero.block.data.imageUrl;
  }

  return productData;
}

async function migrate() {
  try {
    console.log('Starting migration: Migrate Products...');

    // Connect to database
    await connectDB();

    // Define product page slugs to migrate
    const productPageSlugs = [
      'tam-op-cau-thang',
      'gach-op-lat',
      'ban',
      'ghe-da-cong-vien',
    ];

    const migratedProducts = [];

    for (const slug of productPageSlugs) {
      const page = await Page.findOne({ slug }).populate('blocks.block').lean();

      if (!page) {
        console.log(`Page ${slug} not found, skipping...`);
        continue;
      }

      console.log(`\nProcessing page: ${slug}`);

      // Check if product already exists
      const existingProduct = await Product.findOne({ slug });
      if (existingProduct) {
        console.log(`Product ${slug} already exists, skipping...`);
        continue;
      }

      // Extract product data
      const productData = await extractProductData(page);

      // Prepare images array
      const images = [];
      if (productData.heroImage) {
        images.push(productData.heroImage);
      }
      // Add variant images
      for (const variant of productData.variants) {
        if (variant.image && !images.includes(variant.image)) {
          images.push(variant.image);
        }
      }

      // Create product
      const product = await Product.create({
        slug: productData.slug,
        name: productData.name,
        description: productData.description,
        variants: productData.variants.map((v: any) => ({
          name: v.name,
          sku: v.sku,
          price: v.price || 0,
        })),
        colors: productData.colors,
        images: images,
        isPublished: true,
      });

      console.log(`Created product: ${product.name} (${product.slug})`);
      console.log(`  - Variants: ${product.variants.length}`);
      console.log(`  - Colors: ${product.colors.length}`);
      console.log(`  - Images: ${product.images.length}`);

      // Mark original page as unpublished (archived)
      await Page.updateOne({ slug }, { isPublished: false });
      console.log(`Archived page: ${slug}`);

      migratedProducts.push(product);
    }

    console.log('\n✓ Migration completed successfully!');
    console.log('Summary:');
    console.log(`  - Products created: ${migratedProducts.length}`);
    console.log(`  - Products:`);
    for (const product of migratedProducts) {
      console.log(`    - ${product.name} (${product.slug})`);
    }

    if (migratedProducts.length === 0) {
      console.log('\nNote: No new products were created. Product pages may have already been migrated.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

export default migrate;
