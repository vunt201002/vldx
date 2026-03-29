import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import * as auditService from '../services/auditService';

// Get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { published } = req.query;

    const filter: any = {};
    if (published === 'true') {
      filter.isPublished = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// Get product by slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// Create product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, name, description, variants, colors, images, isPublished } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const product = await Product.create({
      slug,
      name,
      description: description || '',
      variants: variants || [],
      colors: colors || [],
      images: images || [],
      isPublished: isPublished || false,
    });

    const admin = (req as AuthRequest).adminUser;
    if (admin) auditService.log({ adminId: admin.id, adminEmail: admin.email, action: 'create', entity: 'product', entityId: product._id.toString(), entityName: product.name });
    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product slug already exists' });
    }
    next(err);
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, name, description, variants, colors, images, isPublished } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update fields
    if (slug !== undefined) product.slug = slug;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (variants !== undefined) product.variants = variants;
    if (colors !== undefined) product.colors = colors;
    if (images !== undefined) product.images = images;
    if (isPublished !== undefined) product.isPublished = isPublished;

    await product.save();

    const admin = (req as AuthRequest).adminUser;
    if (admin) auditService.log({ adminId: admin.id, adminEmail: admin.email, action: 'update', entity: 'product', entityId: product._id.toString(), entityName: product.name });
    res.json({ success: true, data: product });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product slug already exists' });
    }
    next(err);
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const admin = (req as AuthRequest).adminUser;
    if (admin) auditService.log({ adminId: admin.id, adminEmail: admin.email, action: 'delete', entity: 'product', entityId: product._id.toString(), entityName: product.name });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Upload product image
export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Assuming image URL is in req.body.imageUrl (from upload middleware)
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }

    product.images.push(imageUrl);
    await product.save();

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};
