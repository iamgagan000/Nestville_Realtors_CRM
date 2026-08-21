import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  project: String,
  location: { type: String, required: true },
  type: { type: String, default: "Apartment" },
  bhk: String,
  minPrice: Number,
  maxPrice: Number,
  status: { type: String, enum: ["Available", "Sold", "Hold"], default: "Available" },
  image: String,
  description: String,
  amenities: [String]
}, { timestamps: true });

export default mongoose.model("Property", propertySchema);
