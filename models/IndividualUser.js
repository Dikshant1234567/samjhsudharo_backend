import mongoose from "mongoose";

const individualUserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    domain: [{ type: String, required: true }],
    description: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

const IndividualUser = mongoose.model("individual_user", individualUserSchema);
export default IndividualUser;
