import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    postType: { type: String, enum: ['event', 'vlog'], required: true },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      refPath: 'authorModel'
    },
    authorModel: {
      type: String,
      required: true,
      enum: ['individual_user', 'group_user', 'ngo']
    },
    domain: { type: String, required: true },
    location: {
      district: { type: String },
      state: { type: String },
      country: { type: String }
    },
    locationText: { type: String },
    date: { type: String },
    time: { type: String },
    requiredVolunteers: { type: Number, default: 0 },
    images: [{ type: String }],
    volunteers: [{
      user: { type: mongoose.Schema.Types.ObjectId, refPath: 'volunteerModel' },
      volunteerModel: {
        type: String,
        enum: ['individual_user', 'group_user', 'ngo']
      },
      joinedAt: { type: Date, default: Date.now }
    }],
    likes: [{
      user: { type: mongoose.Schema.Types.ObjectId, refPath: 'likeModel' },
      likeModel: {
        type: String,
        enum: ['individual_user', 'group_user', 'ngo']
      }
    }],
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, refPath: 'commentModel' },
      commentModel: {
        type: String,
        enum: ['individual_user', 'group_user', 'ngo']
      },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Post = mongoose.model("post", postSchema);
export default Post;