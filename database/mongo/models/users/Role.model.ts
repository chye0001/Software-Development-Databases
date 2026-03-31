import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRole extends Document {
  id: string;
  role: string;
}

const RoleSchema = new Schema<IRole>(
  {
    id:   { type: String, required: true, unique: true },
    role: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  {
    versionKey: false,
  }
);

export const Role: Model<IRole> =
  mongoose.models.Role ?? mongoose.model<IRole>("Role", RoleSchema);