import express from "express";
import {
  createPost,
  getPosts,
  getPostsByLocation,
  getPostById,
  updatePost,
  likePost,
  addComment,
  volunteerForPost,
  deletePost
} from "../controllers/postController.js";

const router = express.Router();

// Post routes
router.post("/", createPost);
router.get("/", getPosts);
router.get("/location", getPostsByLocation);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.post("/:id/like", likePost);
router.post("/:id/comment", addComment);
router.post("/:id/volunteer", volunteerForPost);
router.delete("/:id", deletePost);

export default router;