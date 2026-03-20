import mongoose, { Document, Schema } from 'mongoose';

export interface IPageBlock {
  block: mongoose.Types.ObjectId;
  order: number;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  description: string;
  bodyClass: string;
  blocks: IPageBlock[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pageBlockSchema = new Schema<IPageBlock>(
  {
    block: {
      type: Schema.Types.ObjectId,
      ref: 'Block',
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const pageSchema = new Schema<IPage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    bodyClass: {
      type: String,
      default: '',
    },
    blocks: [pageBlockSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPage>('Page', pageSchema);
