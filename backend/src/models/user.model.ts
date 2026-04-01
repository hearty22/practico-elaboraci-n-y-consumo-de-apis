import { model, Schema } from "mongoose";
import { IUser } from "@/handlers/auth/auth.schema.js";

// Mongoose schema for the User document

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const UserModel = model<IUser>("Users", UserSchema);

export default UserModel;
