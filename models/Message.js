import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "senderModel" },
  senderModel: { type: String, required: true, enum: ["individual_user", "group_user", "ngo"] },
  text: { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.model("message", messageSchema);
export default Message;