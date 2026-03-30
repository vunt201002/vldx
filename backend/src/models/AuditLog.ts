import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  adminId: string;
  adminEmail: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  entity: 'product' | 'material' | 'blog' | 'block' | 'page' | 'theme' | 'menu' | 'customer';
  entityId: string;
  entityName: string;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete', 'publish', 'unpublish'],
    },
    entity: {
      type: String,
      required: true,
      enum: ['product', 'material', 'blog', 'block', 'page', 'theme', 'menu', 'customer'],
    },
    entityId: { type: String, required: true },
    entityName: { type: String, required: true },
    changes: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ entity: 1, createdAt: -1 });
auditLogSchema.index({ adminEmail: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
