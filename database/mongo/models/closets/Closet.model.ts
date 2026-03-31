import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISharedWith {
  userId: mongoose.Types.ObjectId;
}

export interface ICloset extends Document {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
  itemIds: mongoose.Types.ObjectId[];
  sharedWith: ISharedWith[];
}

const SharedWithSchema = new Schema<ISharedWith>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    _id: false, // embedded sub-document, no own ObjectId needed
  }
);

const ClosetSchema = new Schema<ICloset>(
  {
    id:          { type: String, required: true, unique: true },
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    isPublic:    { type: Boolean, required: true, default: false },
    userId:      { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemIds:     [{ type: Schema.Types.ObjectId, ref: "Item" }],
    sharedWith:  [SharedWithSchema],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export const Closet: Model<ICloset> =
  mongoose.models.Closet ?? mongoose.model<ICloset>("Closet", ClosetSchema);