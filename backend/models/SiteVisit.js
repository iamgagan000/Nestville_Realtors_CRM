import mongoose from "mongoose";

const siteVisitSchema = new mongoose.Schema(
  {
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    visitDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Completed",
        "Cancelled",
        "No Show",
      ],
      default: "Scheduled",
    },

    visitors: {
      type: Number,
      default: 1,
      min: 1,
    },

    feedback: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SiteVisit = mongoose.model(
  "SiteVisit",
  siteVisitSchema
);

export default SiteVisit;