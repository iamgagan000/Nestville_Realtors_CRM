import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

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

    value: {
      type: Number,
      default: 0,
      min: 0,
    },

    stage: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Site Visit",
        "Negotiation",
        "Booking",
        "Won",
        "Lost",
      ],
      default: "New",
    },

    probability: {
      type: Number,
      default: 20,
      min: 0,
      max: 100,
    },

    expectedClose: {
      type: Date,
      default: null,
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

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;