import { Ilist } from "@/interfaces/list.interface.js";
import { model, Schema } from 'mongoose';
import { IList, IListItem } from '@/models/list.schema.js';

// Mongoose schema for the sub-document (list items)
const ListItemSchema = new Schema<IListItem>({
  // Note: Mongoose automatically adds an _id, so we don't redefine it unless necessary.
  content: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Mongoose schema for the main List document
const ListSchema = new Schema<IList>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    items: [ListItemSchema], // Array of sub-documents
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
    versionKey: false, // Hides the __v field from documents
  }
);

// The model that we will use to interact with the 'lists' collection
const ListModel = model<IList>('List', ListSchema);

export default ListModel;
