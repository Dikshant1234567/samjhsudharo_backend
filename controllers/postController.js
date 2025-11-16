import Post from "../models/Post.js";
import mongoose from "mongoose";
import { sendLocationNotification, sendPostUpdateNotification } from "../utils/notifications.js";
import { isValidDomain } from "../utils/domainCategories.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      postType,
      author,
      authorModel,
      domain,
      location,
      locationText,
      images,
      priority,
      date,
      time,
      requiredVolunteers
    } = req.body;

    if (!postType || !['event', 'vlog'].includes(postType)) {
      return res.status(400).json({ message: "Invalid or missing postType" });
    }

    // Validate domain
    if (!isValidDomain(domain)) {
      return res.status(400).json({ message: "Invalid domain category" });
    }

    const postData = {
      title,
      description,
      postType,
      author,
      authorModel,
      domain,
      location,
      locationText,
      images: images || [],
      priority: priority || "medium",
      date,
      time,
      requiredVolunteers: Number(requiredVolunteers) || 0
    };

    const post = await Post.create(postData);

    // Send real-time notification
    const io = req.app.get('io');
    if (io) {
      sendLocationNotification(io, post);
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts with filtering options
export const getPosts = async (req, res) => {
  try {
    const { domain, district, state, status, priority, sort, type, postType } = req.query;
    
    // Build filter object
    const filter = {};
    if (domain) filter.domain = domain;
    if (district) filter["location.district"] = district;
    if (state) filter["location.state"] = state;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const typeFilter = postType || type;
    if (typeFilter) filter.postType = typeFilter;
    
    // Default to active posts
    if (!status) filter.isActive = true;
    
    // Build sort object
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "priority") sortOption = { priority: -1, createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    
    const posts = await Post.find(filter)
      .sort(sortOption)
      .populate({
        path: "author",
        select: "name firstName lastName email"
      });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by location for notifications
export const getPostsByLocation = async (req, res) => {
  try {
    const { district, state, country } = req.query;
    
    if (!district && !state && !country) {
      return res.status(400).json({ message: "At least one location parameter is required" });
    }
    
    const filter = { isActive: true };
    if (district) filter["location.district"] = district;
    if (state) filter["location.state"] = state;
    if (country) filter["location.country"] = country;
    
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "author",
        select: "name firstName lastName email"
      });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "author",
        select: "name firstName lastName email"
      })
      .populate({
        path: "volunteers.user",
        select: "name firstName lastName email"
      })
      .populate({
        path: "comments.user",
        select: "name firstName lastName email"
      });
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const {
      title,
      description,
      domain,
      location,
      images,
      status,
      priority
    } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.body.userId) {
      return res.status(401).json({ message: "User not authorized to update this post" });
    }
    
    // Update fields
    post.title = title || post.title;
    post.description = description || post.description;
    post.domain = domain || post.domain;
    post.location = location || post.location;
    post.images = images || post.images;
    post.status = status || post.status;
    post.priority = priority || post.priority;
    
    const updatedPost = await post.save();
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const { userId, userModel } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.find(
      like => like.user.toString() === userId && like.likeModel === userModel
    );
    
    if (alreadyLiked) {
      // Remove like
      post.likes = post.likes.filter(
        like => !(like.user.toString() === userId && like.likeModel === userModel)
      );
    } else {
      // Add like
      post.likes.push({ user: userId, likeModel: userModel });
    }
    
    await post.save();
    
    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { userId, userModel, text } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const newComment = {
      user: userId,
      commentModel: userModel,
      text
    };
    
    post.comments.push(newComment);
    
    await post.save();
    
    // Get the newly added comment with populated user
    const populatedPost = await Post.findById(req.params.id)
      .populate({
        path: "comments.user",
        select: "name firstName lastName email"
      });
    
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];
    
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Volunteer for a post
export const volunteerForPost = async (req, res) => {
  try {
    const { userId, userModel } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user already volunteered
    const alreadyVolunteered = post.volunteers.find(
      volunteer => volunteer.user.toString() === userId && volunteer.volunteerModel === userModel
    );
    
    if (alreadyVolunteered) {
      return res.status(400).json({ message: "User already volunteered for this post" });
    }
    
    // Add volunteer
    post.volunteers.push({
      user: userId,
      volunteerModel: userModel
    });
    
    await post.save();
    
    res.status(200).json({
      message: "Successfully volunteered for the post",
      volunteers: post.volunteers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.body.userId) {
      return res.status(401).json({ message: "User not authorized to delete this post" });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};