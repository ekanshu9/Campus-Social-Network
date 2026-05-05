"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activePartner, setActivePartner] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initChat = async () => {
      try {
        const adminToken = Cookies.get("adminToken");
        if (adminToken) {
          toast.error("Privacy restricted: Admins cannot view user chats.");
          router.push("/");
          return;
        }

        const role = Cookies.get("role");
        let userId = null;

        // Try to get current user ID based on role
        const meRes = await axios.get("/api/users/me");
        if (meRes.data.success) {
          userId = meRes.data.user._id;
        }

        // If /api/users/me failed (teacher), decode from token
        if (!userId) {
          const token = Cookies.get("token");
          if (!token) {
            router.push("/login");
            return;
          }
          // Decode JWT to get ID (payload is the second part)
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.id;
        }

        setCurrentUserId(userId);
        await fetchConversations();

        // Check if we came from a profile page with pre-set partner
        const partnerId = searchParams.get("partnerId");
        const partnerName = searchParams.get("partnerName");
        const partnerModel = searchParams.get("partnerModel");
        if (partnerId && partnerName) {
          setActivePartner({
            partnerId,
            partnerName,
            partnerModel: partnerModel || "User",
          });
        }
      } catch (error) {
        // Try token decode as fallback
        const token = Cookies.get("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setCurrentUserId(payload.id);
            await fetchConversations();
          } catch {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get("/api/messages/conversations");
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (error) {
      console.error("Failed to fetch conversations");
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const res = await axios.get(`/api/messages/chat?partnerId=${partnerId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        axios.get("/api/users/allProfiles"),
        axios.get("/api/teachers/allTeachers"),
      ]);
      if (studentsRes.data.success) {
        setUsers(studentsRes.data.users.filter((u) => u._id !== currentUserId));
      }
      if (teachersRes.data.success) {
        const t = teachersRes.data.teachers || teachersRes.data.users || [];
        setTeachers(t.filter((t) => t._id !== currentUserId));
      }
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };

  // Poll for new messages when a chat is active
  useEffect(() => {
    if (!activePartner) return;
    fetchMessages(activePartner.partnerId);
    const interval = setInterval(() => {
      fetchMessages(activePartner.partnerId);
    }, 3000);
    return () => clearInterval(interval);
  }, [activePartner]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;

    try {
      const res = await axios.post("/api/messages/send", {
        receiverId: activePartner.partnerId,
        receiverModel: activePartner.partnerModel,
        receiverName: activePartner.partnerName,
        message: newMessage.trim(),
      });

      if (res.data.success) {
        setNewMessage("");
        fetchMessages(activePartner.partnerId);
        fetchConversations();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const startNewChat = (person, model) => {
    setActivePartner({
      partnerId: person._id,
      partnerName: model === "User" ? person.userName : person.name,
      partnerModel: model,
    });
    setShowNewChat(false);
    setSearchQuery("");
  };

  const filteredPeople = [...users.map((u) => ({ ...u, _type: "User" })), ...teachers.map((t) => ({ ...t, _type: "Teacher" }))].filter((p) => {
    const name = p._type === "User" ? p.userName : p.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-xl">Loading Chat...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col md:flex-row" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sidebar - Conversations */}
        <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold">Messages</h2>
            <button
              onClick={() => {
                setShowNewChat(!showNewChat);
                if (!showNewChat) fetchAllUsers();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              {showNewChat ? "Back" : "+ New"}
            </button>
          </div>

          {showNewChat ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {filteredPeople.map((person) => (
                <div
                  key={person._id}
                  onClick={() => startNewChat(person, person._type)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                    {(person._type === "User" ? person.userName : person.name)?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{person._type === "User" ? person.userName : person.name}</p>
                    <p className="text-xs text-gray-500">{person._type === "Teacher" ? "Teacher" : "Student"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-gray-500 text-center p-4 text-sm">No conversations yet. Start a new chat!</p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.partnerId}
                    onClick={() => setActivePartner(conv)}
                    className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-800 ${
                      activePartner?.partnerId === conv.partnerId ? "bg-gray-800" : "hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                      {conv.partnerName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium truncate">{conv.partnerName}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 bg-gray-900">
                <h3 className="text-lg font-semibold">{activePartner.partnerName}</h3>
                <p className="text-xs text-gray-500">{activePartner.partnerModel === "Teacher" ? "Teacher" : "Student"}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.sender === currentUserId;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMine
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-gray-800 text-gray-200 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-[10px] mt-1 opacity-60">
                          {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-800 bg-gray-900 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-4">💬</p>
                <p className="text-gray-500 text-lg">Select a conversation or start a new chat</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
