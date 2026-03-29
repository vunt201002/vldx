import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlogComment {
  _id: Types.ObjectId;
  customer?: Types.ObjectId;
  name: string;
  content: string;
  createdAt: Date;
}

export interface IBlogLike {
  customer?: Types.ObjectId;
  sessionId?: string;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  viewCount: number;
  likes: IBlogLike[];
  comments: IBlogComment[];
  createdAt: Date;
  updatedAt: Date;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const blogCommentSchema = new Schema<IBlogComment>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
);

const blogLikeSchema = new Schema<IBlogLike>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    sessionId: { type: String },
  },
  { _id: false },
);

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[a-z0-9-]+$/.test(v),
        message: 'Slug can only contain lowercase letters, numbers, and hyphens',
      },
    },
    content: { type: String, default: '' },
    excerpt: { type: String, default: '', trim: true },
    coverImage: { type: String, default: '' },
    tags: [{ type: String, trim: true, lowercase: true }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    viewCount: { type: Number, default: 0 },
    likes: [blogLikeSchema],
    comments: [blogCommentSchema],
  },
  { timestamps: true },
);

blogPostSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title);
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ isPublished: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
