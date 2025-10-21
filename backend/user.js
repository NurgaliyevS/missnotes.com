import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String },
    image: String,
    // Email sequence tracking fields
    email_sequence_started_at: {
      type: Date,
      default: null
    },
    email_sequence_day: {
      type: Number,
      default: 0,
      min: 0,
      max: 7
    },
    email_sequence_completed: {
      type: Boolean,
      default: false
    },
    email_sequence_paused: {
      type: Boolean,
      default: false
    },
    last_email_sent_at: {
      type: Date,
      default: null
    },
    email_sequence_opted_out: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;