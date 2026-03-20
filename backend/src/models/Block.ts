import mongoose, { Document, Schema } from 'mongoose';

export interface IBlock extends Document {
  type: string;
  name: string;
  data: Record<string, any>;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const blockSchema = new Schema<IBlock>(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBlock>('Block', blockSchema);
