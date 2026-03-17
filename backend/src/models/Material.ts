import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specs: Map<string, string>;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const materialSchema = new Schema<IMaterial>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['xi-mang', 'gach', 'cat-son', 'thep', 'da', 'cat', 'ong-nuoc', 'vat-lieu-khac'],
    },
    images: [{ type: String }],
    specs: { type: Map, of: String, default: {} },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

materialSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

export const Material = mongoose.model<IMaterial>('Material', materialSchema);
