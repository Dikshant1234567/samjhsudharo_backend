import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const createOrGetChat = async (req, res) => {
  try {
    const { userAId, userAType, userBId, userBType } = req.body;
    if (!userAId || !userBId || !userAType || !userBType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let chat = await Chat.findOne({
      $and: [
        { participants: { $elemMatch: { user: userAId } } },
        { participants: { $elemMatch: { user: userBId } } },
      ],
    });
    if (!chat) {
      chat = await Chat.create({
        participants: [
          { user: userAId, userModel: userAType, lastSeenAt: new Date() },
          { user: userBId, userModel: userBType, lastSeenAt: new Date() },
        ],
      });
    }
    return res.status(201).json(chat);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const listChatsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const chats = await Chat.find({ participants: { $elemMatch: { user: userId } } })
      .sort({ updatedAt: -1 })
      .populate({
        path: "participants.user",
        select: "name firstName lastName email",
        model: function (doc) { return doc.userModel; }
      });

    const results = await Promise.all(chats.map(async (chat) => {
      const lastMsg = await Message.findOne({ chat: chat._id }).sort({ createdAt: -1 });
      const me = chat.participants.find(p => String(p.user) === String(userId));
      const lastSeenAt = me?.lastSeenAt ?? new Date(0);
      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        createdAt: { $gt: lastSeenAt },
        sender: { $ne: userId }
      });

      // Find the other participant to display name
      const other = chat.participants.find(p => String(p.user) !== String(userId));
      let otherName = "Conversation";
      if (other && other.user && typeof other.user === 'object') {
        const u = other.user;
        otherName = (u.name ?? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()) || otherName;
      }

      return {
        _id: chat._id,
        participants: chat.participants,
        otherName,
        lastMessage: lastMsg ? { text: lastMsg.text, createdAt: lastMsg.createdAt } : null,
        unreadCount
      };
    }));

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const listMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ chat: id }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, senderModel, text } = req.body;
    if (!senderId || !senderModel || !text) return res.status(400).json({ message: "Missing required fields" });
    const msg = await Message.create({ chat: id, sender: senderId, senderModel, text });
    // bump chat updatedAt for sorting
    await Chat.findByIdAndUpdate(id, { updatedAt: new Date() });
    const io = req.app.get("io");
    if (io) io.to(String(id)).emit("chat:message", msg);
    return res.status(201).json(msg);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Mark chat as seen by user
export const markChatSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const chat = await Chat.findById(id);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    chat.participants = chat.participants.map(p =>
      String(p.user) === String(userId) ? { ...p.toObject(), lastSeenAt: new Date() } : p
    );
    await chat.save();
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};