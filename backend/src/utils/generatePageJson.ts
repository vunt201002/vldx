import fs from 'fs';
import path from 'path';
import { config } from '../config/env';
import blockJsonMappings from '../config/blockJsonMapping';
import Theme from '../models/Theme';

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
