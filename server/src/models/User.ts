import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { USER_ROLES } from "../constants";

interface IAvatar {
  url: string;
  publicId: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar: IAvatar;
  role: "admin" | "customer";
  isVerified: boolean;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const avatarSchema = new Schema<IAvatar>(
  {
    url: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    avatar: {
      type: avatarSchema,
      default: () => ({
        url: "",
        publicId: "",
      }),
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;