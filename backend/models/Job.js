const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      default: "Not specified"
    },

    description: {
      type: String,
      required: true
    },

    skills: {
      type: [String],
      default: []
    },

    package: {
      type: String,
      default: "Not specified"
    },

    eligibility: {
      type: String,
      default: "Open to eligible students"
    },

    deadline: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);