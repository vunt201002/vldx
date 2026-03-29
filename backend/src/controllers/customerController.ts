import { Request, Response, NextFunction } from 'express';
import Customer from '../models/Customer';

/**
 * GET /api/customers
 * Get all customers (paginated, searchable)
 * Admin only
 */
export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || '';
    const verified = req.query.verified as string;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (verified !== undefined) {
      query.isEmailVerified = verified === 'true';
    }

    // Get total count
    const total = await Customer.countDocuments(query);

    // Get customers
    const customers = await Customer.find(query)
      .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/customers/:id
 * Get customer by ID
 * Admin only
 */
export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .select('-password -refreshTokens -emailVerificationToken -passwordResetToken')
      .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/customers/:id
 * Update customer (admin override)
 * Admin only
 */
export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, phone, isEmailVerified } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    // Update fields
    if (firstName !== undefined) customer.firstName = firstName.trim();
    if (lastName !== undefined) customer.lastName = lastName.trim();
    if (phone !== undefined) customer.phone = phone ? phone.trim() : undefined;
    if (isEmailVerified !== undefined) customer.isEmailVerified = isEmailVerified;

    await customer.save();

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: {
        id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        isEmailVerified: customer.isEmailVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/customers/:id
 * Delete customer
 * Admin only
 */
export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
