import { Router } from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/uploadController';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

router.post('/', upload.single('image'), uploadImage);
router.delete('/:publicId', deleteImage);

export default router;
