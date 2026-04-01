import { model, Schema } from "mongoose";
import { IList } from "@/handlers/lists/list.schema.js";

// Mongoose schema for the main List document
const ListSchema = new Schema<IList>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    is_complete: {
      type: Boolean,
      default: false,
    },
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
    versionKey: false, // Hides the __v field from documents
  },
);

// The model that we will use to interact with the 'lists' collection
const ListModel = model<IList>("Lists", ListSchema);

export default ListModel;
