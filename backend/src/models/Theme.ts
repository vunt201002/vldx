import mongoose, { Document, Schema } from 'mongoose';

export interface IThemeBlock {
  block: mongoose.Types.ObjectId;
  order: number;
}

export interface IThemeSection {
  blocks: IThemeBlock[];
}

export interface ITheme extends Document {
  name: string;
  isActive: boolean;
  header: IThemeSection;
  footer: IThemeSection;
  createdAt: Date;
  updatedAt: Date;
}

const themeBlockSchema = new Schema<IThemeBlock>(
  {
    block: {
      type: Schema.Types.ObjectId,
      ref: 'Block',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const themeSectionSchema = new Schema<IThemeSection>(
  {
    blocks: [themeBlockSchema],
  },
  { _id: false }
);

const themeSchema = new Schema<ITheme>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    header: {
      type: themeSectionSchema,
      default: { blocks: [] },
    },
    footer: {
      type: themeSectionSchema,
      default: { blocks: [] },
    },
  },
  { timestamps: true }
);

// Ensure only one theme is active at a time
themeSchema.pre('save', async function(next) {
  if (this.isActive) {
    // Deactivate all other themes
    await mongoose.model('Theme').updateMany(
      { _id: { $ne: this._id }, isActive: true },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.model<ITheme>('Theme', themeSchema);
