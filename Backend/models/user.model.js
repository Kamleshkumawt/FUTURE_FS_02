import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username must be less than 50 characters"],
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "fullName is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username must be less than 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [6, "Email should be at least 6 characters long"],
      match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
      index: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\+?[0-9]{10,15}$/, "Please fill a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    profile_picture: {
      url: {
        type: String,
        trim: true,
      },
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      bytes: Number,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
      index: true,
    },
    address: [
      {
        name: String,
        contact: String,
        label: {
          type: String,
          default: "Home",
        },
        street: String,
        city: String,
        state: String,
        country: {
          type: String,
          default: "India",
        },
        pinCode: String,
        famousPlaces: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
        latitude: String,
        longitude: String,
      },
    ],
    isDisabled: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre("save", function (next) {
  if (typeof this.profile_picture === "string") {
    this.profile_picture = {
      url: this.profile_picture,
      uploadedAt: new Date(),
    };
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

userSchema.set("autoIndex", process.env.NODE_ENV !== "production");

const User = mongoose.model("user", userSchema);

export default User;