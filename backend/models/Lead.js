import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: String,
  source: { type: String, default: "Website" },
  budget: Number,
  location: String,
  propertyType: { type: String, default: "Apartment" },
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Won", "Lost"],
    default: "New"
  },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
