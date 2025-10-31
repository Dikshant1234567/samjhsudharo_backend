import mongoose from "mongoose";

const groupUserSchema = new mongoose.Schema(
  {
    organizationName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    domain: [{ type: String, required: true }],
    description: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    contactNumber: { type: String },
  },
  { timestamps: true }
);

const GroupUser = mongoose.model("group_user", groupUserSchema);
export default GroupUser;
