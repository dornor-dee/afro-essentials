import mongoose, { Document, Schema } from "mongoose";

export interface IProductImage {
  url: string;
  publicId: string;
}
export interface IProductVariant {
  _id: mongoose.Types.ObjectId;

  attributes: {
    size?: string;
    length?: string;
    color?: string;
  };

  sku: string;
  stock: number;
  price?: number;
  salePrice?: number;
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;

  description: string;
  shortDescription?: string;

  price: number;
  salePrice?: number;

  sku: string;

  category: mongoose.Types.ObjectId;

  brand: string;
  material?: string;
  countryOfOrigin: string;

  images: IProductImage[];
  thumbnail: IProductImage;

  variants: IProductVariant[];

  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;

  tags: string[];

  averageRating: number;
  reviewCount: number;

  isActive: boolean;
}

const productImageSchema = new Schema<IProductImage>(
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

const productVariantSchema = new Schema<IProductVariant>(
  {
    attributes: {
      size: {
        type: String,
        trim: true,
        default: "",
      },

      length: {
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

    sku: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    price: {
      type: Number,
      min: 0,
    },

    salePrice: {
      type: Number,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      min: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    material: {
      type: String,
      default: "",
    },

    countryOfOrigin: {
      type: String,
      default: "Ghana",
      trim: true,
    },

    images: {
      type: [productImageSchema],
      default: [],
    },

    thumbnail: {
      type: productImageSchema,
      required: true,
    },

    variants: {
      type: [productVariantSchema],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
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

/*
  Prevent duplicate variant SKUs inside the same product.
*/
productSchema.pre("validate", function () {
  const variantSkus = this.variants
    .map((variant) => variant.sku?.trim().toUpperCase())
    .filter(Boolean);

  const uniqueSkus = new Set(variantSkus);

  if (uniqueSkus.size !== variantSkus.length) {
    throw new Error(
      "Variant SKUs must be unique within a product"
    );
  }
});

export default mongoose.model<IProduct>(
  "Product",
  productSchema
);