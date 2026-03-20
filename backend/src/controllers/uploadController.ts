import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

const ALLOWED_FOLDERS = ['products', 'pages', 'gallery', 'general'] as const;
type Folder = (typeof ALLOWED_FOLDERS)[number];

function isAllowedFolder(folder: string): folder is Folder {
  return ALLOWED_FOLDERS.includes(folder as Folder);
}

/**
 * POST /api/upload
 * Upload a single image to Cloudinary.
 * Body: multipart/form-data with "image" file field and optional "folder" text field.
 * Folder maps to: vlxd/{folder} in Cloudinary.
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file provided' });
      return;
    }

    const folder = (req.body.folder as string) || 'general';
    if (!isAllowedFolder(folder)) {
      res.status(400).json({
        success: false,
        message: `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}`,
      });
      return;
    }

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `vlxd/${folder}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        folder: `vlxd/${folder}`,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/upload/:publicId
 * Delete an image from Cloudinary by its public_id.
 * publicId is passed as a URL-encoded path param (e.g., vlxd%2Fproducts%2Fabc123).
 */
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      res.status(400).json({ success: false, message: 'publicId is required' });
      return;
    }

    const decoded = decodeURIComponent(publicId);

    // Only allow deleting images in our vlxd/ folder
    if (!decoded.startsWith('vlxd/')) {
      res.status(403).json({ success: false, message: 'Can only delete images in vlxd/ folder' });
      return;
    }

    const result = await cloudinary.uploader.destroy(decoded);

    res.json({
      success: true,
      data: { result: result.result },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
