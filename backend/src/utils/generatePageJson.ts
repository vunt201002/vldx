import fs from 'fs';
import path from 'path';
import { config } from '../config/env';
import blockJsonMappings from '../config/blockJsonMapping';

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
  const mapping = blockJsonMappings[block.type];
  if (!mapping) {
    return {
      id: block.type,
      section: { type: block.type, settings: { ...block.data }, blocks: [] },
    };
  }

  const settings: Record<string, any> = {};

  for (const key of mapping.settingsFields) {
    if (block.data[key] !== undefined) {
      settings[key] = block.data[key];
    }
  }

  if (mapping.settingsArrayFields) {
    for (const key of mapping.settingsArrayFields) {
      if (block.data[key] !== undefined) {
        settings[key] = block.data[key];
      }
    }
  }

  if (mapping.flattenFields) {
    for (const { dataKey, prefix, subKeys } of mapping.flattenFields) {
      const nested = block.data[dataKey];
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
    const arr = block.data[dataKey];
    if (Array.isArray(arr)) {
      for (const item of arr) {
        blocks.push({ type: blockType, settings: { ...item } });
      }
    }
  }

  return {
    id: block.type,
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
