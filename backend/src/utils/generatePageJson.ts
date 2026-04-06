import fs from 'fs';
import path from 'path';
import { config } from '../config/env';
import blockJsonMappings from '../config/blockJsonMapping';
import Theme from '../models/Theme';
import Menu from '../models/Menu';
import BlogPost from '../models/BlogPost';
import Product from '../models/Product';

interface PopulatedBlock {
  _id: string;
  type: string;
  name: string;
  data: Record<string, any>;
  settings: Record<string, any>;
}

interface PageData {
  slug: string;
  title: string;
  description: string;
  bodyClass: string;
  displayFont: string;
  bodyFont: string;
  blocks: { block: PopulatedBlock; order: number }[];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Transform a single DB block into a page JSON section entry.
 */
function blockToSection(block: PopulatedBlock): { id: string; section: any } {
  const data = block.data || {};
  const mapping = blockJsonMappings[block.type];
  if (!mapping) {
    return {
      id: block._id,
      section: { type: block.type, settings: { ...data }, blocks: [] },
    };
  }

  const settings: Record<string, any> = {};

  for (const key of mapping.settingsFields) {
    if (data[key] !== undefined) {
      settings[key] = data[key];
    }
  }

  if (mapping.settingsArrayFields) {
    for (const key of mapping.settingsArrayFields) {
      if (data[key] !== undefined) {
        settings[key] = data[key];
      }
    }
  }

  if (mapping.flattenFields) {
    for (const { dataKey, prefix, subKeys } of mapping.flattenFields) {
      const nested = data[dataKey];
      if (nested && typeof nested === 'object') {
        for (const sub of subKeys) {
          if (nested[sub] !== undefined) {
            settings[`${prefix}${capitalize(sub)}`] = nested[sub];
          }
        }
      }
    }
  }

  const blocks: any[] = [];
  for (const { dataKey, blockType } of mapping.arrayBlocks) {
    const arr = data[dataKey];
    if (Array.isArray(arr)) {
      for (const item of arr) {
        blocks.push({ type: blockType, settings: { ...item } });
      }
    }
  }

  return {
    id: block._id,
    section: { type: block.type, settings, blocks },
  };
}

/**
 * Transform a full Page document (with populated blocks) into JSON format.
 */
export function generatePageJson(page: PageData): object {
  const sorted = [...page.blocks].sort((a, b) => a.order - b.order);

  const order: string[] = [];
  const sections: Record<string, any> = {};

  for (const { block } of sorted) {
    const { id, section } = blockToSection(block);
    order.push(id);
    sections[id] = section;
  }

  return {
    page: {
      title: page.title,
      description: page.description || '',
      bodyClass: page.bodyClass || '',
      displayFont: page.displayFont || '',
      bodyFont: page.bodyFont || '',
    },
    order,
    sections,
  };
}

/**
 * Write {slug}.json to the frontend config directory.
 */
export function writePageJson(slug: string, json: object): void {
  const dir = config.frontendConfigDir;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
}

/**
 * Delete a page's JSON file.
 */
export function deletePageJson(slug: string): void {
  const filePath = path.join(config.frontendConfigDir, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Transform DB→JSON format from the editor's PUT payload back to DB block.data format.
 */
export function sectionToBlockData(type: string, sectionSettings: Record<string, any>, sectionBlocks: any[]): Record<string, any> {
  const mapping = blockJsonMappings[type];
  if (!mapping) {
    return { ...sectionSettings };
  }

  const data: Record<string, any> = {};

  for (const key of mapping.settingsFields) {
    if (sectionSettings[key] !== undefined) {
      data[key] = sectionSettings[key];
    }
  }

  if (mapping.settingsArrayFields) {
    for (const key of mapping.settingsArrayFields) {
      if (sectionSettings[key] !== undefined) {
        data[key] = sectionSettings[key];
      }
    }
  }

  if (mapping.flattenFields) {
    for (const { dataKey, prefix, subKeys } of mapping.flattenFields) {
      const nested: Record<string, any> = {};
      for (const sub of subKeys) {
        const flatKey = `${prefix}${capitalize(sub)}`;
        if (sectionSettings[flatKey] !== undefined) {
          nested[sub] = sectionSettings[flatKey];
        }
      }
      if (Object.keys(nested).length > 0) {
        data[dataKey] = nested;
      }
    }
  }

  for (const { dataKey, blockType } of mapping.arrayBlocks) {
    const items = sectionBlocks
      .filter((b: any) => b.type === blockType)
      .map((b: any) => ({ ...b.settings }));
    if (items.length > 0) {
      data[dataKey] = items;
    }
  }

  return data;
}

/**
 * Generate page JSON with merged theme (header + body + footer).
 * This is the new function that merges global theme sections with page body.
 */
export async function generatePageJsonWithTheme(page: PageData): Promise<object> {
  // Get active theme
  const theme = await Theme.findOne({ isActive: true })
    .populate('header.blocks.block')
    .populate('footer.blocks.block')
    .lean();

  const order: string[] = [];
  const sections: Record<string, any> = {};

  // Add header blocks from theme
  if (theme && theme.header && theme.header.blocks) {
    const sortedHeader = [...theme.header.blocks].sort((a: any, b: any) => a.order - b.order);
    for (const { block } of sortedHeader) {
      const { id, section } = blockToSection(block as any);
      order.push(id);
      sections[id] = section;
    }
  }

  // Add body blocks from page
  const sortedBody = [...page.blocks].sort((a, b) => a.order - b.order);
  for (const { block } of sortedBody) {
    const { id, section } = blockToSection(block);
    order.push(id);
    sections[id] = section;
  }

  // Add footer blocks from theme
  if (theme && theme.footer && theme.footer.blocks) {
    const sortedFooter = [...theme.footer.blocks].sort((a: any, b: any) => a.order - b.order);
    for (const { block } of sortedFooter) {
      const { id, section } = blockToSection(block as any);
      order.push(id);
      sections[id] = section;
    }
  }

  return {
    page: {
      title: page.title,
      description: page.description || '',
      bodyClass: page.bodyClass || '',
      displayFont: page.displayFont || '',
      bodyFont: page.bodyFont || '',
    },
    order,
    sections,
  };
}

/**
 * Write page JSON with theme merging.
 */
export async function writePageJsonWithTheme(slug: string, page: PageData): Promise<void> {
  const json = await generatePageJsonWithTheme(page);
  writePageJson(slug, json);
}

/**
 * Generate and write theme.json for static data mode.
 * Contains header and footer blocks in the same format as the API response.
 */
export async function writeThemeJson(): Promise<void> {
  const theme = await Theme.findOne({ isActive: true })
    .populate('header.blocks.block')
    .populate('footer.blocks.block')
    .lean();

  if (!theme) return;

  const sortedHeaderBlocks = [...theme.header.blocks].sort((a: any, b: any) => a.order - b.order);
  const sortedFooterBlocks = [...theme.footer.blocks].sort((a: any, b: any) => a.order - b.order);

  // Resolve menu items for navbar blocks
  const headerBlocksData = await Promise.all(
    sortedHeaderBlocks.map(async (b: any) => {
      const blockData: any = {
        _id: b.block._id,
        type: b.block.type,
        name: b.block.name,
        data: b.block.data ?? {},
        settings: b.block.settings ?? {},
        order: b.order,
      };

      if (b.block.type === 'navbar' && b.block.data?.menuHandle) {
        const menu = await Menu.findOne({ handle: b.block.data.menuHandle }).lean();
        if (menu) {
          const sortedItems = [...(menu as any).items].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          blockData.menuItems = sortedItems.map((item: any) => ({
            label: item.label,
            url: item.url,
          }));
        }
      }

      return blockData;
    })
  );

  const footerBlocksData = sortedFooterBlocks.map((b: any) => ({
    _id: b.block._id,
    type: b.block.type,
    name: b.block.name,
    data: b.block.data ?? {},
    settings: b.block.settings ?? {},
    order: b.order,
  }));

  const json = {
    header: { blocks: headerBlocksData },
    footer: { blocks: footerBlocksData },
  };

  // Write to config dir parent (sibling of pages/)
  const dir = path.dirname(config.frontendConfigDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, 'theme.json');
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
}

/**
 * Generate and write blog.json for static data mode.
 * Contains all published blog posts (without content/comments/likes for list view).
 */
export async function writeBlogJson(): Promise<void> {
  const posts = await BlogPost.find({ isPublished: true })
    .select('-content -comments -likes')
    .sort({ publishedAt: -1 })
    .lean();

  const tags: string[] = await BlogPost.distinct('tags', { isPublished: true });

  // Also generate individual post files for detail pages
  const fullPosts = await BlogPost.find({ isPublished: true })
    .populate('comments.customer', 'firstName lastName profilePicture')
    .sort({ publishedAt: -1 })
    .lean();

  const dir = path.dirname(config.frontendConfigDir);
  const blogDir = path.join(dir, 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  // Write blog list
  const listJson = {
    success: true,
    data: posts,
    total: posts.length,
    page: 1,
    totalPages: 1,
  };
  fs.writeFileSync(path.join(dir, 'blog.json'), JSON.stringify(listJson, null, 2), 'utf-8');

  // Write tags
  fs.writeFileSync(path.join(dir, 'blog-tags.json'), JSON.stringify({ success: true, data: tags.sort() }, null, 2), 'utf-8');

  // Write individual post files
  for (const post of fullPosts) {
    const postData = {
      ...post,
      likeCount: (post as any).likes?.length || 0,
      commentCount: (post as any).comments?.length || 0,
      likes: undefined,
    };
    fs.writeFileSync(
      path.join(blogDir, `${post._id}.json`),
      JSON.stringify({ success: true, data: postData }, null, 2),
      'utf-8'
    );
  }
}

/**
 * Generate and write products.json for static data mode.
 */
export async function writeProductsJson(): Promise<void> {
  const products = await Product.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .lean();

  const dir = path.dirname(config.frontendConfigDir);
  const productsDir = path.join(dir, 'products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  // Write products list
  fs.writeFileSync(
    path.join(dir, 'products.json'),
    JSON.stringify({ success: true, data: products }, null, 2),
    'utf-8'
  );

  // Write individual product files (by slug)
  for (const product of products) {
    fs.writeFileSync(
      path.join(productsDir, `${(product as any).slug}.json`),
      JSON.stringify({ success: true, data: product }, null, 2),
      'utf-8'
    );
  }
}
