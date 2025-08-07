/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
} from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const conversationMessages = messages[userId] || [];

  useEffect(() => {
    dispatch(getConversationMessages(userId));
    dispatch(markMessagesAsRead(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    dispatch(
      sendMessage({
        receiver: userId,
        content: newMessage,
      })
    );
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading && conversationMessages.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/messages"
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold"
      >
        <FaArrowLeft className="mr-2" />
        Back to Messages
      </Link>

      <div className="glass rounded-xl overflow-hidden shadow-lg">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-semibold">
            {conversationMessages.length > 0
              ? conversationMessages[0].sender._id === user._id
                ? conversationMessages[0].receiver.name
                : conversationMessages[0].sender.name
              : "Conversation"}
          </h2>
        </div>

        <div className="p-4 h-[60vh] overflow-y-auto bg-gray-50">
          {conversationMessages.length > 0 ? (
            <div className="space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender._id === user._id
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="mb-1">{message.content}</p>
                    <p
                      className={`text-xs ${
                        message.sender._id === user._id
                          ? "text-blue-200"
                          : "text-gray-500"
                      } text-right`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="form-input flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Type your message..."
              aria-label="Type your message"
            />
            <button
              type="submit"
              className={`bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={newMessage.trim() === ""}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
