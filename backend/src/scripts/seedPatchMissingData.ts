/**
 * Patch script: restore lost data for collections, about, and footer blocks
 * after the shopify-theme-system merge. Non-destructive — only patches fields
 * that are empty or missing; does not overwrite existing data.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Block from '../models/Block';
import Page from '../models/Page';
import Theme from '../models/Theme';
import { config } from '../config/env';
import { generatePageJson, writePageJson } from '../utils/generatePageJson';

dotenv.config();

// ─── Patch data ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: 'Gạch Lát Sân Vườn',
    slug: 'gach-lat',
    desc: 'Bề mặt chống trơn, chịu lực cao, phù hợp lối đi và sân vườn ngoài trời.',
    specs: '400×400mm  ·  50mm dày',
    color: 'from-amber-800/80 to-amber-900/90',
  },
  {
    name: 'Đá Granite',
    slug: 'da-granite',
    desc: 'Đá tự nhiên gia công chính xác, bề mặt mài nhám hoặc đánh bóng theo yêu cầu.',
    specs: '600×300mm  ·  20mm dày',
    color: 'from-stone-600/80 to-stone-800/90',
  },
  {
    name: 'Terrazzo',
    slug: 'terrazzo',
    desc: 'Phối trộn đá marble, granite và xi măng — mỗi viên gạch là một tác phẩm nghệ thuật.',
    specs: '400×400mm  ·  30mm dày',
    color: 'from-rose-800/70 to-stone-800/90',
  },
  {
    name: 'Gạch Block',
    slug: 'gach-block',
    desc: 'Gạch thông gió trang trí, tạo điểm nhấn kiến trúc cho tường rào và mặt tiền.',
    specs: '190×190mm  ·  90mm dày',
    color: 'from-slate-600/80 to-slate-800/90',
  },
  {
    name: 'Đá Ốp Lát',
    slug: 'da-op-lat',
    desc: 'Đá ốp tường và lát nền, vân tự nhiên, phù hợp không gian nội thất cao cấp.',
    specs: '600×600mm  ·  15mm dày',
    color: 'from-warm-500/80 to-warm-800/90',
  },
  {
    name: 'Bậc Thang & Coping',
    slug: 'bac-thang',
    desc: 'Bậc cầu thang và viền hồ bơi, bo cạnh tròn an toàn, chống trơn trượt.',
    specs: '1000×350mm  ·  40mm dày',
    color: 'from-cyan-800/70 to-slate-800/90',
  },
];

const ABOUT_STATS = [
  { value: '15+', label: 'năm kinh nghiệm' },
  { value: '500+', label: 'dự án hoàn thành' },
  { value: '50+', label: 'mẫu sản phẩm' },
  { value: '100%', label: 'nguyên liệu tự nhiên' },
];

const ABOUT_PARAGRAPHS = [
  'chúng tôi tin rằng mỗi viên gạch, mỗi tấm đá đều kể một câu chuyện riêng. từ những mỏ đá tự nhiên đến xưởng sản xuất thủ công, mỗi sản phẩm đều mang trong mình dấu ấn của đất, nước và bàn tay nghệ nhân việt nam.',
  'với quy trình sản xuất thân thiện môi trường và tiêu chuẩn chất lượng quốc tế, sản phẩm của chúng tôi không chỉ đẹp mà còn bền vững theo thời gian — từ sân vườn đến nội thất, từ hồ bơi đến mặt tiền công trình.',
];

const FOOTER_DATA = {
  brandName: 'bê tông việt',
  copyright: '© 2026 bê tông việt. thiết kế tại việt nam.',
  bgColor: '#1A1714',
  textColor: '#C8B89A',
  fontSize: '0.875rem',
  infoLines: [
    { text: 'Hotline: 1900 xxxx xx' },
    { text: 'Email: info@betongviet.vn' },
    { text: 'Showroom: TP. Hồ Chí Minh — T2–T7: 8:00–17:30' },
  ],
  socialLinks: [
    { label: 'Facebook', icon: 'facebook', href: '#' },
    { label: 'Instagram', icon: 'instagram', href: '#' },
    { label: 'Zalo', icon: 'zalo', href: '#' },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isEmpty(val: any): boolean {
  if (val === null || val === undefined) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === 'object') return Object.keys(val).length === 0;
  return false;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function seedPatchMissingData() {
  await mongoose.connect(config.mongodbUri);
  console.log('Connected to MongoDB\n');

  const pages = await Page.find({}).populate('blocks.block').lean();
  const pagesToRegenerate: string[] = [];

  // ── 1. Patch collections + about blocks on each page ──────────────────────
  for (const page of pages) {
    let pagePatched = false;

    for (const entry of (page as any).blocks) {
      const block = entry.block;
      if (!block) continue;

      if (block.type === 'collections') {
        const products = block.data?.products;
        if (isEmpty(products)) {
          await Block.findByIdAndUpdate(block._id, {
            $set: { 'data.products': PRODUCTS },
          });
          console.log(`  [${page.slug}] collections → patched products (${PRODUCTS.length} items)`);
          pagePatched = true;
        } else {
          console.log(`  [${page.slug}] collections → products OK (${products.length} items), skipping`);
        }
      }

      if (block.type === 'about') {
        const patches: Record<string, any> = {};

        if (isEmpty(block.data?.stats)) {
          patches['data.stats'] = ABOUT_STATS;
          console.log(`  [${page.slug}] about → patched stats`);
        }
        if (isEmpty(block.data?.paragraphs)) {
          patches['data.paragraphs'] = ABOUT_PARAGRAPHS;
          console.log(`  [${page.slug}] about → patched paragraphs`);
        }

        if (Object.keys(patches).length > 0) {
          await Block.findByIdAndUpdate(block._id, { $set: patches });
          pagePatched = true;
        } else {
          console.log(`  [${page.slug}] about → data OK, skipping`);
        }
      }
    }

    if (pagePatched) {
      pagesToRegenerate.push(page.slug);
    }
  }

  // ── 2. Patch footer blocks in active Theme ─────────────────────────────────
  const theme = await Theme.findOne({ isActive: true }).populate('footer.blocks.block').lean();
  if (theme) {
    for (const entry of (theme as any).footer.blocks) {
      const block = entry.block;
      if (!block || block.type !== 'footer') continue;

      const patches: Record<string, any> = {};
      const d = block.data || {};

      if (!d.brandName)               patches['data.brandName']    = FOOTER_DATA.brandName;
      if (!d.copyright)               patches['data.copyright']    = FOOTER_DATA.copyright;
      if (!d.bgColor)                 patches['data.bgColor']      = FOOTER_DATA.bgColor;
      if (!d.textColor)               patches['data.textColor']    = FOOTER_DATA.textColor;
      if (!d.fontSize)                patches['data.fontSize']     = FOOTER_DATA.fontSize;
      if (isEmpty(d.infoLines))       patches['data.infoLines']    = FOOTER_DATA.infoLines;
      if (isEmpty(d.socialLinks))     patches['data.socialLinks']  = FOOTER_DATA.socialLinks;

      if (Object.keys(patches).length > 0) {
        await Block.findByIdAndUpdate(block._id, { $set: patches });
        console.log(`  [theme footer] patched: ${Object.keys(patches).join(', ')}`);
      } else {
        console.log(`  [theme footer] data OK, skipping`);
      }
    }
  } else {
    console.log('  No active theme found — skipping footer patch');
  }

  // ── 3. Regenerate JSON for patched pages ───────────────────────────────────
  if (pagesToRegenerate.length > 0) {
    console.log('\nRegenerating JSON files...');
    for (const slug of pagesToRegenerate) {
      const fresh = await Page.findOne({ slug }).populate('blocks.block').lean();
      if (fresh) {
        const json = generatePageJson(fresh as any);
        writePageJson(slug, json);
        console.log(`  → ${slug}.json regenerated`);
      }
    }
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

seedPatchMissingData().catch((err) => {
  console.error('Patch failed:', err);
  process.exit(1);
});
