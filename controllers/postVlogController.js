import PostVlog from "../models/PostVlog.js";

export const createPostVlog = async (req, res) => {
  try {
    const { title, description, author, authorModel, domain, location, locationText, images } = req.body;
    if (!title || !description || !author || !authorModel || !domain) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const post = await PostVlog.create({
      title,
      description,
      author,
      authorModel,
      domain,
      location,
      locationText,
      images: images || [],
    });
    const io = req.app.get("io");
    if (io) {
      io.emit("post:created", { type: "vlog", post });
    }
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostVlogs = async (req, res) => {
  try {
    const { domain, authorId, authorModel } = req.query;
    const filter = {};
    if (domain) filter.domain = domain;
    if (authorId) filter.author = authorId;
    if (authorModel) filter.authorModel = authorModel;
    const posts = await PostVlog.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPostVlogById = async (req, res) => {
  try {
    const post = await PostVlog.findById(req.params.id).populate({
      path: "author",
      select: "name firstName lastName email",
    });
    if (!post) return res.status(404).json({ message: "PostVlog not found" });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};