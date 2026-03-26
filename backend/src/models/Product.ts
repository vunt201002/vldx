import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant {
  name: string;
  sku: string;
  price: number;
}

export interface IProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface IProduct extends Document {
  slug: string;
  name: string;
  description: string;
  variants: IProductVariant[];
  colors: IProductColor[];
  images: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const productColorSchema = new Schema<IProductColor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hex: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^#[0-9A-Fa-f]{6}$/.test(v);
        },
        message: 'Hex color must be in format #RRGGBB',
      },
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[a-z0-9-]+$/.test(v);
        },
        message: 'Slug can only contain lowercase letters, numbers, and hyphens',
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    variants: [productVariantSchema],
    colors: [productColorSchema],
    images: [{
      type: String,
      trim: true,
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Add index for published products
productSchema.index({ isPublished: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
