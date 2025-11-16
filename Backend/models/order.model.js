import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  label: { type: String, default: "Home" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: "India" },
  postalCode: { type: String, required: true },
  famousPlaces: { type: String },
  isDefault: { type: Boolean, default: false },
  latitude: { type: String },
  longitude: { type: String }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "product", 
    required: true 
  },

  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "sellerId", 
    required: false 
  },

  title: { type: String },  
  price: { type: Number, required: true },  
  quantity: { type: Number, required: true },
  thumbnail: { type: String },  
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  items: [orderItemSchema],

  total_amount: {
    type: Number,
    required: true,
    min: [1, "Total amount must be at least 1"]
  },

  subtotal: {
    type: Number,
    required: true
  },

  tax_amount: {
    type: Number,
    default: 0
  },

  shipping_fee: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded"
    ],
    default: "Pending"
  },

  shipping_address: addressSchema,

  payment_method: {
    type: String,
    enum: ["cash_on_delivery", "online_payment"],
    default: "cash_on_delivery"
  },

  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending"
  },

  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    default: null
  },

  tracking_number: {
    type: String,
    unique: true,
    sparse: true
  },

  expected_delivery: {
    type: Date
  },

}, { timestamps: true });


// ----------------------------
// 🔥 Indexes for Faster Queries
// ----------------------------
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "items.productId": 1 });
orderSchema.index({ "items.sellerId": 1 });  // Multi-seller marketplace


// ----------------------------
// 🔥 Auto Generate Tracking Number
// ----------------------------
orderSchema.pre("save", function (next) {
  if (!this.tracking_number) {
    this.tracking_number = "TRK-" + Date.now() + "-" + Math.floor(Math.random() * 9999);
  }
  next();
});


// ----------------------------
// 🔥 Auto Calculate Total
// ----------------------------
orderSchema.pre("validate", function (next) {
  if (this.items?.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.total_amount = this.subtotal + this.tax_amount + this.shipping_fee;
  }
  next();
});


const Order = mongoose.model("order", orderSchema);
export default Order;
