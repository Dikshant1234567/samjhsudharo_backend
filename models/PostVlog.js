import mongoose from "mongoose";

const postVlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "authorModel",
    },
    authorModel: {
      type: String,
      required: true,
      enum: ["individual_user", "group_user", "ngo"],
    },
    domain: { type: String, required: true },
    location: {
      district: { type: String },
      state: { type: String },
      country: { type: String },
    },
    locationText: { type: String },
    images: [{ type: String }],
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, refPath: "likeModel" },
        likeModel: {
          type: String,
          enum: ["individual_user", "group_user", "ngo"],
        },
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, refPath: "commentModel" },
        commentModel: {
          type: String,
          enum: ["individual_user", "group_user", "ngo"],
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PostVlog = mongoose.model("post_vlog", postVlogSchema);
export default PostVlog;