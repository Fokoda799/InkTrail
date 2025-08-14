// models/Notification.js
import mongoose from "mongoose";
import { io, connectedUsers } from "../server.js"; // Import the io instance from server.js

const notificationSchema = new mongoose.Schema(
  {
    // The user who will receive this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The user who triggered this notification (actor)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of notification (helps with rendering different UIs)
    type: {
      type: String,
      enum: ["like", "comment", "mention", "follow", "blog", "custom"],
      required: true,
    },

    // Title
    title: {
      type: String,
      trim: true,
      default: "",
    },
    
    // The message or content of the notification
    message: {
      type: String,
      trim: true,
      default: "",
    },

    // Optional: for custom notifications, we can store additional data
    relatedContent: {
      type: { type: String }, // e.g., "Post", "Comment"
      title: { type: String }, // e.g., "New Post", "New Comment"
      content: { type: String }, // e.g., "Check out this new post!", "You have a new comment!"
    },

    // Optional: for comments, likes, etc. we link the related post/comment
    target: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true }, // the ID of the related entity
      type: { type: String, required: true }, // e.g., "Post", "Comment"
    },

    // Whether the user has seen this notification
    isRead: {
      type: Boolean,
      default: false,
    },

    // Optional: direct URL to the resource (makes UI navigation faster)
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for faster queries (most common query: find all unread for a user)
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

notificationSchema.statics.addNotification = async function (data) {
  // Check if this kind of notification sent before
  try {
    const existing = await this.model("Notification").findOne({
      recipient: data.recipient,
      sender: data.sender,
      type: data.type,
      target: data.target,
    });
    // if (existing) {
    //   console.log("Data:", data, "Existing Notification:", existing);
    //   console.log("Notification already exists, skipping creation.");
    //   return;
    // }
    const notification = new this(data);
    await notification.save();

    // Emit notification to the recipient via socket.io
    io.to(connectedUsers[data.recipient.toString()]).emit("receiveNotification");
    
    return notification;
  } catch (error) {
    console.error("Error adding notification:", error);
    throw new Error("Failed to add notification");
  }
}
export default mongoose.model("Notification", notificationSchema);
