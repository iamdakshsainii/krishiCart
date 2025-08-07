import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { socket } from "../utils/socket"

const TEMPLATES = [
  "Hi! How can I help you?",
  "Thanks for your message!",
  "Your order is ready for pickup.",
  "Please let me know if you have any questions.",
]

const MessageThread = ({ user }) => {
  const { userId } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  // Fetch messages history on mount or user change
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await axios.get(`/api/messages/${userId}`)
        setMessages(res.data.data || [])
        // Mark messages as read after fetching
        await axios.put(`/api/messages/read/${userId}`)
      } catch (err) {
        console.error("Failed to fetch messages:", err)
      }
    }
    fetchMessages()
  }, [userId])

  // Listen for real-time new messages
  useEffect(() => {
    const handleNewMessage = (data) => {
      const fromOrToCurrent = data.from === userId || data.to === userId
      if (fromOrToCurrent) {
        setMessages((prev) => [...prev, data.message])
      }
    }

    socket.on("newMessage", handleNewMessage)

    return () => {
      socket.off("newMessage", handleNewMessage)
    }
  }, [userId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message handler
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    try {
      const res = await axios.post("/api/messages", {
        receiver: userId,
        content: input,
      })
      setMessages((prev) => [...prev, res.data.data])
      setInput("")
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto p-6 flex flex-col h-[600px]">
      {/* Messages List */}
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-3 flex ${
              msg.sender === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.sender === user._id ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400 block text-right mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Templates */}
      <div className="mb-3 flex flex-wrap gap-2">
        {TEMPLATES.map((text, idx) => (
          <button
            key={idx}
            className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs hover:bg-blue-200"
            onClick={() => setInput(text)}
            type="button"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Input and Send */}
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default MessageThread
