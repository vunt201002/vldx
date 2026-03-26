import { Request, Response, NextFunction } from 'express';
import Menu from '../models/Menu';

// Get all menus
export const getAllMenus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: menus });
  } catch (err) {
    next(err);
  }
};

// Get menu by ID
export const getMenuById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await Menu.findById(req.params.id).lean();

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    res.json({ success: true, data: menu });
  } catch (err) {
    next(err);
  }
};

// Get menu by handle
export const getMenuByHandle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await Menu.findOne({ handle: req.params.handle }).lean();

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    res.json({ success: true, data: menu });
  } catch (err) {
    next(err);
  }
};

// Create menu
export const createMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, handle, items } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    // Sort items by order
    const sortedItems = items ? items.map((item: any, index: number) => ({
      ...item,
      order: item.order !== undefined ? item.order : index,
    })) : [];

    const menu = await Menu.create({
      name,
      handle,
      items: sortedItems,
    });

    res.status(201).json({ success: true, data: menu });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Menu handle already exists' });
    }
    next(err);
  }
};

// Update menu
export const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, handle, items } = req.body;

    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    // Update fields
    if (name !== undefined) menu.name = name;
    if (handle !== undefined) menu.handle = handle;
    if (items !== undefined) {
      // Sort items by order
      menu.items = items.map((item: any, index: number) => ({
        ...item,
        order: item.order !== undefined ? item.order : index,
      }));
    }

    await menu.save();

    res.json({ success: true, data: menu });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Menu handle already exists' });
    }
    next(err);
  }
};

// Delete menu
export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    res.json({ success: true, message: 'Menu deleted successfully' });
  } catch (err) {
    next(err);
  }
};
