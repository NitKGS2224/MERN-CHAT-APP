

import Message from "../models/Message.js";
import { io, userSocketMap } from "../server.js"
import User from "../models/User.js";

export const testing = async (req, res) => {
  return res.json({ message: "This is working...." })
}

export const getUsersForSidebar = async (req, res) => {


  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password")

    // count number of message not seen 
    const unseenMessage = {}
    const promises = filteredUsers.map(async (user) => {
      const message = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
      if (message.length > 0) {
        unseenMessage[user._id] = message.length;
      }
    })

    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessage })
  }
  catch (err) {
    res.json({ success: false, message: err.message })
  }
}

// Get all messages for selected user

export const getMessages = async (req, res) => {
  console.log("call1")
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    })
    await Message.updateMany({ senderId: selectedUserId, receiverId: myId },
      { seen: true }
    )

    res.json({ success: true, messages })
  }
  catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message })
  }
}
// api to marks message as seen using message id

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true })
    res.json({ success: true })
  }
  catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message })
  }

  console.log("call2")
}

// send message to selected user

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;


    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
  
    })

    //Emit the new message to the receivers socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.json({ success: true, newMessage })
  }
  catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message })
  }
  console.log("call3")
}