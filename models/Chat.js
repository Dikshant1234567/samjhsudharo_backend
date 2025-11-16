import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "userModel" },
  userModel: { type: String, required: true, enum: ["individual_user", "group_user", "ngo"] },
  // Track last time the participant saw the chat
  lastSeenAt: { type: Date, default: Date.now }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  participants: { type: [participantSchema], required: true },
}, { timestamps: true });

const Chat = mongoose.model("chat", chatSchema);
export default Chat;