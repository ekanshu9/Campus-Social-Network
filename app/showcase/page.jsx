"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

const ShowcasePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubLink: "",
    liveLink: "",
    screenshots: [],
  });
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await axios.get("/api/users/me");
        if (meRes.data.success) {
          setCurrentUserId(meRes.data.user._id);
          setIsAdmin(meRes.data.user.isAdmin || false);
        }
      } catch (err) {}
      await fetchProjects();
      setLoading(false);
    };
    init();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/showcase/all");
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }
    try {
      const res = await axios.post("/api/showcase/create", formData);
      if (res.data.success) {
        toast.success("Project showcased!");
        setShowAddModal(false);
        setFormData({ title: "", description: "", githubLink: "", liveLink: "", screenshots: [] });
        fetchProjects();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleUpvote = async (projectId) => {
    try {
      const res = await axios.post("/api/showcase/upvote", { projectId });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchProjects();
      }
    } catch (error) {
      toast.error("Login required to upvote");
    }
  };

  const handleReview = async (projectId) => {
    if (!reviewText.trim()) return;
    try {
      const res = await axios.post("/api/showcase/review", { projectId, comment: reviewText });
      if (res.data.success) {
        toast.success("Review added!");
        setReviewText("");
        fetchProjects();
      }
    } catch (error) {
      toast.error("Login required to review");
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await axios.delete(`/api/admin/deleteShowcase?id=${projectId}`);
      if (res.data.success) {
        toast.success("Project deleted");
        fetchProjects();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-xl">Loading Showcase...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">🚀 Project Showcase</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              + Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📂</p>
              <p className="text-gray-500 text-lg">No projects yet. Be the first to showcase!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all"
                >
                  {/* Screenshot */}
                  {project.screenshots?.length > 0 && (
                    <div className="relative w-full h-48">
                      <Image
                        src={project.screenshots[0]}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Author */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                        {project.authorName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-400">{project.authorName}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>

                    {/* Links */}
                    <div className="flex gap-3 mb-4">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-400 hover:text-green-300"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpvote(project._id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                            project.upvotes?.includes(currentUserId)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          ▲ {project.upvotes?.length || 0}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="bg-red-900/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 px-3 py-1 rounded-full text-sm transition-colors border border-red-900/50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        💬 {project.reviews?.length || 0} Reviews
                      </button>
                    </div>

                    {/* Reviews Section */}
                    {expandedProject === project._id && (
                      <div className="mt-4 border-t border-gray-800 pt-4">
                        {project.reviews?.map((review, i) => (
                          <div key={i} className="mb-3 p-2 bg-gray-800 rounded">
                            <p className="text-xs text-blue-400 font-medium">{review.reviewerName}</p>
                            <p className="text-sm text-gray-300">{review.comment}</p>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write a review..."
                            className="flex-1 bg-gray-800 text-white text-sm rounded p-2 focus:outline-none"
                          />
                          <button
                            onClick={() => handleReview(project._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <h2 className="text-2xl font-semibold mb-6 text-white">🚀 Showcase Your Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Title*</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">GitHub Link</label>
                <input
                  type="text"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Live Demo Link</label>
                <input
                  type="text"
                  value={formData.liveLink}
                  onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Screenshot</label>
                <CldUploadWidget
                  uploadPreset="peerView"
                  onSuccess={(result) => {
                    const url = result.info.secure_url;
                    setFormData((prev) => ({
                      ...prev,
                      screenshots: [...prev.screenshots, url],
                    }));
                    toast.success("Screenshot uploaded!");
                  }}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">
                      Upload Screenshot
                    </button>
                  )}
                </CldUploadWidget>
                {formData.screenshots.length > 0 && (
                  <p className="text-xs text-green-400 mt-1">{formData.screenshots.length} screenshot(s) uploaded</p>
                )}
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4">
                Publish Project
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowcasePage;
