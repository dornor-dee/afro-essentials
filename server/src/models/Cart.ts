import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  variant: {
    size?: string;
    color?: string;
  };
  unitPrice: number;
  totalPrice: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  totalItems: number;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    variant: {
      size: {
        type: String,
        trim: true,
        default: "",
      },
      color: {
        type: String,
        trim: true,
        default: "",
      },
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICart>("Cart", cartSchema);