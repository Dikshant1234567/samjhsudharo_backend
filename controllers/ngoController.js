import NGO from "../models/NGO.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new NGO
export const registerNGO = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      description,
      domains,
      location,
      contactNumber,
      website,
      registrationNumber,
      establishedYear,
    } = req.body;

    // Check if NGO already exists
    const ngoExists = await NGO.findOne({ email });
    if (ngoExists) {
      return res.status(400).json({ message: "NGO already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new NGO
    const ngo = await NGO.create({
      name,
      email,
      password: hashedPassword,
      description,
      domains,
      location,
      contactNumber,
      website,
      registrationNumber,
      establishedYear,
    });

    if (ngo) {
      res.status(201).json({
        _id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        domains: ngo.domains,
        token: generateToken(ngo._id),
      });
    } else {
      res.status(400).json({ message: "Invalid NGO data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login NGO
export const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if NGO exists
    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      _id: ngo._id,
      name: ngo.name,
      email: ngo.email,
      domains: ngo.domains,
      isVerified: ngo.isVerified,
      averageRating: ngo.averageRating,
      token: generateToken(ngo._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get NGO profile
export const getNGOProfile = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id)
      .select("-password")
      .populate("activeProjects")
      .populate("completedProjects");
    
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    
    res.status(200).json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update NGO profile
export const updateNGOProfile = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.ngo._id);
    
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    
    // Update fields
    ngo.name = req.body.name || ngo.name;
    ngo.description = req.body.description || ngo.description;
    ngo.domains = req.body.domains || ngo.domains;
    ngo.location = req.body.location || ngo.location;
    ngo.contactNumber = req.body.contactNumber || ngo.contactNumber;
    ngo.website = req.body.website || ngo.website;
    ngo.logo = req.body.logo || ngo.logo;
    
    // Update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      ngo.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedNGO = await ngo.save();
    
    res.status(200).json({
      _id: updatedNGO._id,
      name: updatedNGO.name,
      email: updatedNGO.email,
      domains: updatedNGO.domains,
      isVerified: updatedNGO.isVerified,
      averageRating: updatedNGO.averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNGOProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const ngo = await NGO.findById(id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    ngo.name = req.body.name ?? ngo.name;
    ngo.description = req.body.description ?? ngo.description;
    ngo.domains = req.body.domains ?? ngo.domains;
    ngo.location = req.body.location ?? ngo.location;
    ngo.contactNumber = req.body.contactNumber ?? ngo.contactNumber;
    ngo.website = req.body.website ?? ngo.website;
    ngo.logo = req.body.logo ?? ngo.logo;

    const updated = await ngo.save();
    return res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      domains: updated.domains,
      isVerified: updated.isVerified,
      averageRating: updated.averageRating,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Rate an NGO
export const rateNGO = async (req, res) => {
  try {
    const { rating, review, userId, userModel } = req.body;
    const ngoId = req.params.id;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }
    
    // Check if user has already rated
    const existingRatingIndex = ngo.ratings.findIndex(
      r => r.user.toString() === userId && r.ratingModel === userModel
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      ngo.ratings[existingRatingIndex].rating = rating;
      ngo.ratings[existingRatingIndex].review = review;
    } else {
      // Add new rating
      ngo.ratings.push({
        user: userId,
        ratingModel: userModel,
        rating,
        review,
      });
    }
    
    // Calculate average rating
    const totalRating = ngo.ratings.reduce((sum, item) => sum + item.rating, 0);
    ngo.averageRating = totalRating / ngo.ratings.length;
    
    await ngo.save();
    
    res.status(200).json({
      message: "Rating submitted successfully",
      averageRating: ngo.averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all NGOs
export const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({})
      .select("name description domains location isVerified averageRating")
      .sort({ averageRating: -1 });
    
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};