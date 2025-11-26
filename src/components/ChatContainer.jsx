import React, { useEffect, useRef, useState, useContext } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { IoSend } from "react-icons/io5";

const ChatContainer = () => {
  const {
    messages = [],
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);
  const { authUser = {}, onlineUsers = [] } = useContext(AuthContext);
  const scrollEnd = useRef(null);
  const [input, setInput] = useState("");

  // Handle sending message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };
  //STORE MSSG WHEN PAGE IS RELOAD
  useEffect(() => {
    if (selectedUser) {
      getMessages?.(selectedUser._id);
    }
  }, [selectedUser]);

  //WHEN SELECTED USER TEXT MSSG PAGE SCROLL  AUTOMATIC &&SEEN MSSG
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
        <h2 className="text-blue-500 text-7xl w-[200]">CHAT APP</h2>
        <p className="mask-t-from-5 text-lg font-medium text-white">
          Connect Share Anything
        </p>
      </div>
    );
  }

  const isSelectedUserOnline = (id) => {
    try {
      return onlineUsers?.includes?.(id);
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser || assets.arrow_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {/* online indicator */}
          {isSelectedUserOnline(selectedUser._id) ? (
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
          )}
        </p>
      </div>

      {/* chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
MAPING THE USERS MSSG && IF I CHICK THE USER THEN OPEN CHAT  
        {messages.map((msg, idx) => {

          const isMine = msg.senderId === authUser._id;
          return (
            <div
              key={msg._id ?? idx}
              className={`flex items-end gap-2 mb-4 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div className="text-center text-xs flex flex-col items-center">
                <img
                  src={
                    isMine
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 rounded-full mb-1"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>

              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
                  isMine
                    ? "bg-violet-500/40 rounded-br-none"
                    : "bg-violet-500/20 rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* input area */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-3 bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
          />

          {/* send button */}
          <IoSend onClick={handleSendMessage} className="w-7 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
