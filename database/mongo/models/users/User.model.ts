import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  roleId: mongoose.Types.ObjectId;
  countryId: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
  {
    id:        { type: String, required: true, unique: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    roleId:    { type: Schema.Types.ObjectId, ref: "Role",    required: true },
    countryId: { type: Schema.Types.ObjectId, ref: "Country", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
  