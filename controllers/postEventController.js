import PostEvent from "../models/PostEvent.js";

export const createPostEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      authorModel,
      domain,
      location,
      locationText,
      images,
      date,
      time,
      requiredVolunteers,
      status,
      priority,
    } = req.body;

    if (!title || !description || !author || !authorModel || !domain) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const post = await PostEvent.create({
      title,
      description,
      author,
      authorModel,
      domain,
      location,
      locationText,
      images: images || [],
      date,
      time,
      requiredVolunteers: Number(requiredVolunteers) || 0,
      status: status || "active",
      priority: priority || "medium",
    });
    const io = req.app.get("io");
    if (io) {
      io.emit("post:created", { type: "event", post });
    }
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostEvents = async (req, res) => {
  try {
    const { domain, authorId, authorModel, status } = req.query;
    const filter = {};
    if (domain) filter.domain = domain;
    if (authorId) filter.author = authorId;
    if (authorModel) filter.authorModel = authorModel;
    if (status) filter.status = status;
    const posts = await PostEvent.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "name firstName lastName email" });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostEventById = async (req, res) => {
  try {
    const post = await PostEvent.findById(req.params.id).populate({
      path: "author",
      select: "name firstName lastName email",
    });
    if (!post) return res.status(404).json({ message: "PostEvent not found" });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};