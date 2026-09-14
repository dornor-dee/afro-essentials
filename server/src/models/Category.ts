import mongoose, { Document, Schema } from "mongoose";

export interface ICategoryImage {
  url: string;
  publicId: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: ICategoryImage;
  description?: string;
  isActive: boolean;
}

const categoryImageSchema = new Schema<ICategoryImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    image: {
      type: categoryImageSchema,
      default: undefined,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>(
  "Category",
  categorySchema
);