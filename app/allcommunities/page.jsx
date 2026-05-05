"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar/Navbar";
import { toast } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

const CommunityPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({ name: "", about: "" });
  const [contentForm, setContentForm] = useState({ title: "", description: "", link: "" });
  const [addingContentTo, setAddingContentTo] = useState(null);

  // Student specific states
  const [activeTab, setActiveTab] = useState("my"); // 'my' or 'browse'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const roleFromCookie = Cookies.get("role");
    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.id);
    } catch (e) {
      console.error("Failed to decode token");
    }

    axios.get("/api/users/me").then((res) => {
      if (res.data.success && res.data.user.isAdmin) {
        setIsAdmin(true);
      }
    }).catch(() => {});

    setRole(roleFromCookie || "student");
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await axios.get("/api/getAllCommunities");
      if (res.data.success) {
        setCommunities(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/teachers/createCommunity", formData);
      if (res.data.success) {
        toast.success("Community created!");
        setShowCreateModal(false);
        setFormData({ name: "", about: "" });
        fetchCommunities();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to create community");
    }
  };

  const handleAddContent = async (e, communityId) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/teachers/contentInCommunity/${communityId}`, contentForm);
      if (res.data.success) {
        toast.success("Content added!");
        setAddingContentTo(null);
        setContentForm({ title: "", description: "", link: "" });
        fetchCommunities();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to add content");
    }
  };

  const handleDelete = async (e, communityId) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this community?")) return;
    try {
      const res = await axios.delete(`/api/admin/deleteCommunity?id=${communityId}`);
      if (res.data.success) {
        toast.success("Community deleted");
        fetchCommunities();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete community");
    }
  };

  const handleJoinLeave = async (e, communityId) => {
    e.stopPropagation(); // Prevent expanding the card when clicking the button
    try {
      const res = await axios.post("/api/community/join", { communityId });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCommunities();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to process request");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-10 h-10 border-t-3 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="text-gray-500 ml-3">Loading communities...</p>
        </div>
      </>
    );
  }

  // Filtering Logic
  let displayedCommunities = communities;
  
  if (role !== "teacher") {
    // Student filtering based on tab
    if (activeTab === "my") {
      displayedCommunities = communities.filter((c) => c.students?.includes(currentUserId));
    } else {
      displayedCommunities = communities.filter((c) => !c.students?.includes(currentUserId));
      
      // Apply search query only in Browse tab
      if (searchQuery.trim()) {
        displayedCommunities = displayedCommunities.filter((c) => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.about.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold">
                🏛️ <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Communities</span>
              </h1>
              <p className="text-gray-500 mt-1">
                {role === "teacher" ? "Manage and post in your communities" : "Join communities and stay updated"}
              </p>
            </div>
            
            {role === "teacher" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition-colors"
              >
                + Create Community
              </button>
            )}
          </div>

          {/* Student Tabs & Search */}
          {role !== "teacher" && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex bg-gray-900 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("my")}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "my" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  My Communities
                </button>
                <button
                  onClick={() => setActiveTab("browse")}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "browse" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Browse
                </button>
              </div>

              {activeTab === "browse" && (
                <div className="flex items-center bg-gray-900 border border-gray-800 rounded-full px-4 py-2 w-full md:w-64 focus-within:border-blue-500 transition-colors">
                  <FaSearch className="text-gray-500 mr-2 text-sm" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search communities..."
                    className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Communities Grid */}
          {displayedCommunities.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
              <p className="text-5xl mb-4">🏛️</p>
              <p className="text-gray-400 text-lg font-medium">
                {role === "teacher" 
                  ? "No communities yet." 
                  : activeTab === "my" 
                    ? "You haven't joined any communities yet." 
                    : "No communities found."}
              </p>
              {role === "teacher" && (
                <p className="text-gray-500 text-sm mt-2">Click "+ Create Community" to get started!</p>
              )}
              {role !== "teacher" && activeTab === "my" && (
                <button 
                  onClick={() => setActiveTab("browse")}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Browse available communities ↗
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedCommunities.map((community) => {
                const isJoined = community.students?.includes(currentUserId);
                
                return (
                  <div
                    key={community._id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
                  >
                    {/* Community Header */}
                    <div
                      className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                      onClick={() => {
                        // Only allow expanding if teacher or if student has joined
                        if (role === "teacher" || isJoined) {
                          setExpandedId(expandedId === community._id ? null : community._id);
                        } else {
                          toast("You need to join this community to see its content.", { icon: "🔒" });
                        }
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-white">{community.name}</h2>
                          {role !== "teacher" && !isJoined && (
                            <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full border border-gray-700">
                              Preview
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3 md:mb-0 max-w-3xl">{community.about}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-800/50">👨‍🏫</div> 
                            {community.ownerName}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-800/50">📝</div>
                            {community.content?.length || 0} posts
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-800/50">👥</div>
                            {community.students?.length || 0} members
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        {/* Admin Delete Button */}
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDelete(e, community._id)}
                            className="text-red-500 hover:text-red-400 text-sm font-medium border border-red-900/50 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        )}
                        
                        {/* Join/Leave Button for Students */}
                        {role !== "teacher" && (
                          <button
                            onClick={(e) => handleJoinLeave(e, community._id)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isJoined 
                                ? "bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-400 border border-gray-700 hover:border-red-800" 
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {isJoined ? "Leave" : "Join"}
                          </button>
                        )}
                        
                        {/* Expand Icon */}
                        {(role === "teacher" || isJoined) && (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${expandedId === community._id ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-800'}`}>
                            {expandedId === community._id ? "▲" : "▼"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === community._id && (role === "teacher" || isJoined) && (
                      <div className="border-t border-gray-800 p-5 md:p-6 bg-gray-900/50">
                        {/* Add Content (Teacher only) */}
                        {role === "teacher" && (
                          <div className="mb-6">
                            {addingContentTo === community._id ? (
                              <form onSubmit={(e) => handleAddContent(e, community._id)} className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-5 space-y-4">
                                <h3 className="text-white font-medium mb-2">Create New Post</h3>
                                <input
                                  type="text"
                                  placeholder="Post Title"
                                  value={contentForm.title}
                                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                  required
                                />
                                <textarea
                                  placeholder="Description / Content"
                                  value={contentForm.description}
                                  onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                                  rows={3}
                                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                  required
                                />
                                <input
                                  type="url"
                                  placeholder="Resource Link (optional, e.g. https://...)"
                                  value={contentForm.link}
                                  onChange={(e) => setContentForm({ ...contentForm, link: e.target.value })}
                                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <div className="flex gap-3 pt-2">
                                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Publish Post
                                  </button>
                                  <button type="button" onClick={() => setAddingContentTo(null)} className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => {
                                  setAddingContentTo(community._id);
                                  setContentForm({ title: "", description: "", link: "" });
                                }}
                                className="w-full border border-dashed border-gray-700 hover:border-blue-500 hover:bg-blue-900/10 text-blue-400 rounded-xl py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all"
                              >
                                <span>+</span> Create New Post
                              </button>
                            )}
                          </div>
                        )}

                        {/* Content List */}
                        {community.content?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {community.content.map((item, index) => (
                              <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors flex flex-col h-full">
                                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 flex-1">{item.description}</p>
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium bg-blue-900/20 px-4 py-2 rounded-lg self-start transition-colors"
                                  >
                                    View Resource ↗
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10 bg-gray-800/30 rounded-xl border border-gray-800 border-dashed">
                            <p className="text-gray-500 text-sm">No posts in this community yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <span>🏛️</span> Create Community
            </h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Community Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Web Development Club"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">About <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Describe what this community is about, who it's for, and what topics will be covered..."
                  required
                />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-900/50 transition-all active:scale-[0.98]">
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityPage;
