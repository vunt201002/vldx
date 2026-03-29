import { Router } from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/uploadController';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (ALLOWED_MIMES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (.jpg, .png, .webp, .gif, .svg)'));
    }
  },
});

import { requireAuth, authenticate } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, upload.single('image'), uploadImage);
router.post('/customer', authenticate, upload.single('image'), uploadImage);
router.delete('/:publicId', requireAuth, deleteImage);

export default router;
