import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String },
    image: String,
    variant_name: { type: String, default: "free" },
    subscription_renews_at: { type: String, default: null },
    ends_at: { type: String, default: null },
    customer_id: String,
    subscription_id: String,
    customer_name: String,
    meetings_available: { type: Number, default: 0 },
    has_received_first_subscription_email: { type: Boolean, default: false },
    is_in_trial: { type: Boolean, default: false },
    trial_ends_at: { type: String, default: null },
    lastReminderRenewalSent: {
      type: Date,
      default: null
    },
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