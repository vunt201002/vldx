import AuditLog from '../models/AuditLog';

interface AuditEntry {
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
}

export function log(entry: AuditEntry): void {
  // Fire and forget — don't block the response
  AuditLog.create(entry).catch((err) => {
    console.error('[AuditLog] Failed to write:', err.message);
  });
}
