import { Router } from 'express';
import * as customerController from '../controllers/customerController';

const router = Router();

// Admin routes - TODO: Add admin authentication middleware when admin auth is implemented
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
