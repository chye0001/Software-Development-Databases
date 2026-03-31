import mongoose, { Schema, Document, Model } from "mongoose";

export interface IImage {
  id: string;
  url: string;
}

const ImageSchema = new Schema<IImage>(
  {
    id:  { type: String, required: true },
    url: { type: String, required: true, trim: true },
  },
  {
    _id: false, // embedded sub-document, no own ObjectId needed
  }
);






export interface IItem extends Document {
  id: string;
  name: string;
  price: mongoose.Types.Decimal128 | null;
  categoryId: mongoose.Types.ObjectId;
  brandIds: mongoose.Types.ObjectId[];
  images: IImage[];
}

const ItemSchema = new Schema<IItem>(
  {
    id:         { type: String, required: true, unique: true },
    name:       { type: String, required: true, trim: true },
    price:      { type: Schema.Types.Decimal128, default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brandIds:   [{ type: Schema.Types.ObjectId, ref: "Brand" }],
    images:     [ImageSchema],
  },
  {
    versionKey: false,
  }
);

export const Item: Model<IItem> =
  mongoose.models.Item ?? mongoose.model<IItem>("Item", ItemSchema);