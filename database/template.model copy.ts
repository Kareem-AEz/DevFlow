import { model, models, Schema } from "mongoose";

export interface ITemplate {}

const TemplateSchema = new Schema<ITemplate>({}, { timestamps: true });

const Template =
  models?.Template || model<ITemplate>("Template", TemplateSchema);

export default Template;
