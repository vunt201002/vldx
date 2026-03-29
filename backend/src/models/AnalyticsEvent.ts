import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  type: 'page_view' | 'product_view' | 'blog_view' | 'color_select';
  path: string;
  referenceId?: string;
  referenceName?: string;
  metadata?: Record<string, any>;
  sessionId?: string;
  userAgent?: string;
  createdAt: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: {
      type: String,
      required: true,
      enum: ['page_view', 'product_view', 'blog_view', 'color_select'],
    },
    path: { type: String, required: true, trim: true },
    referenceId: { type: String },
    referenceName: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed },
    sessionId: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90-day TTL
analyticsEventSchema.index({ referenceId: 1, type: 1 });
analyticsEventSchema.index({ 'metadata.hex': 1, type: 1 });

export default mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);
