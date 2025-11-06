import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema, model } = mongoose;

const storeImageSchema = new Schema({
  url: { type: String, trim: true },
  publicId: String,
  width: Number,
  height: Number,
  format: String,
  sizeInBytes: Number,
  uploadedAt: { type: Date, default: Date.now },
});

const addressSchema = new Schema({
  label: { type: String, default: "Home", trim: true },
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, default: "India", trim: true },
  postalCode: { type: String, trim: true },
  landmark: { type: String, trim: true },
  isDefault: { type: Boolean, default: false },
  latitude: { type: String, trim: true },
  longitude: { type: String, trim: true },
});

const bankDetailsSchema = new Schema({
  accountNumber: { type: String, trim: true },
  ifscCode: { type: String, trim: true },
  bankName: { type: String, trim: true },
  accountHolderName: { type: String, trim: true },
});

const policiesSchema = new Schema({
  returnPolicy: { type: String, trim: true },
  shippingPolicy: { type: String, trim: true },
});

const sellerSchema = new Schema(
  {
    fullName: { type: String, trim: true },
    storeName: { type: String, trim: true },
    storeDescription: { type: String, trim: true },
    storeImage: storeImageSchema,
    storeAddress: addressSchema,
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true, },
    password: { type: String, required: true },
    gstNumber: { type: String, trim: true },
    bankDetails: bankDetailsSchema,
    averageRating: { type: Number, default: 0, min: 0, max: 10 },
    policies: policiesSchema,
    isDisabled: { type: Boolean, default: false },
    lastActive: { type: Date },
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

sellerSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

sellerSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id, role: "seller", storeName: this.storeName },
    process.env.JWT_SECRET,
    { expiresIn: "50d" }
  );
};

sellerSchema.index({ storeName: "text", "storeAddress.city": 1 });

const Seller = model("seller", sellerSchema);
export default Seller;
