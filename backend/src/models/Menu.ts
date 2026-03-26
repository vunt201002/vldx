import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem {
  label: string;
  url: string;
  order: number;
}

export interface IMenu extends Document {
  name: string;
  handle: string;
  items: IMenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[a-z0-9-]+$/.test(v);
        },
        message: 'Handle can only contain lowercase letters, numbers, and hyphens',
      },
    },
    items: [menuItemSchema],
  },
  { timestamps: true }
);

// Auto-generate handle from name if not provided
menuSchema.pre('save', function(next) {
  if (!this.handle && this.name) {
    this.handle = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.model<IMenu>('Menu', menuSchema);
