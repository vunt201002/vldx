import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Products
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  description: z.string().max(5000).optional(),
  variants: z.array(z.object({
    name: z.string().min(1),
    price: z.number().min(0).optional(),
    unit: z.string().optional(),
  })).optional(),
  colors: z.array(z.object({
    name: z.string().min(1),
    hex: z.string().optional(),
    imageUrl: z.string().url().optional(),
  })).optional(),
  images: z.array(z.string().url()).optional(),
  isPublished: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Menus
export const createMenuSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  handle: z.string().regex(/^[a-z0-9-]+$/).max(100).optional(),
  items: z.array(z.object({
    label: z.string().min(1, 'Label is required'),
    url: z.string().min(1, 'URL is required'),
    order: z.number().optional(),
  })).optional(),
});

export const updateMenuSchema = createMenuSchema.partial();

// Theme pages
export const createPageSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  bodyClass: z.string().max(100).optional(),
});

// Materials
export const createMaterialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  category: z.string().min(1).optional(),
  unit: z.string().optional(),
  price: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().url().optional(),
}).passthrough(); // allow extra fields from Mongoose schema

export const updateMaterialSchema = createMaterialSchema.partial();

// Blog posts
export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPublished: z.boolean().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

// Blog comments
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(2000),
  name: z.string().max(100).optional(),
});
