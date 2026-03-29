import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getAuditLogs);

export default router;
