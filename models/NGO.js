import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    domains: [{ type: String, required: true }],
    location: {
      address: { type: String },
      district: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    },
    contactNumber: { type: String, required: true },
    website: { type: String },
    logo: { type: String },
    registrationNumber: { type: String, required: true },
    establishedYear: { type: Number },
    isVerified: { type: Boolean, default: false },
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, refPath: 'ratingModel' },
      ratingModel: {
        type: String,
        enum: ['individual_user', 'group_user']
      },
      rating: { type: Number, min: 1, max: 5, required: true },
      review: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 },
    completedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    activeProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }]
  },
  { timestamps: true }
);

// Calculate average rating before saving
ngoSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, item) => sum + item.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
  }
  next();
});

const NGO = mongoose.model("ngo", ngoSchema);
export default NGO;