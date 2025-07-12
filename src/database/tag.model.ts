import { Document, model, models, Schema } from "mongoose";

export interface ITag {
  name: string;
  questions: number;
}

export type ITagDoc = ITag & Document;

const TagSchema = new Schema<ITagDoc>(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
