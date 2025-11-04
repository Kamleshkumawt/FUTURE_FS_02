import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      url: { type: String, trim: true },
      publicId: String,
      width: Number,
      height: Number,
      format: String,
      bytes: Number,
      uploadedAt: { type: Date, default: Date.now },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12); // stronger salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


adminSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

adminSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" } // slightly shorter and secure token lifetime
  );
};

adminSchema.methods.updateLastActive = async function () {
  this.lastActive = new Date();
  await this.save();
};

const Admin = mongoose.model("admin", adminSchema);

export default Admin;
