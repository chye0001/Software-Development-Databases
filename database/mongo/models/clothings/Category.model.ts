import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    id:   { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
  },
  {
    versionKey: false,
  }
);

export const Category: Model<ICategory> =
  mongoose.models.Category ?? mongoose.model<ICategory>("Category", CategorySchema);
