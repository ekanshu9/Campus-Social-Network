// components/Modal.js
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const AddProjects = ({ isOpen, onClose, userId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const projectData = {
      userId,
      title,
      description,
      link,
    };
    try {
      const response = await axios.post("/api/users/projects", projectData);
      if (response.data.success) {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Add Project
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            required
          />

          <label className="mb-2 text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            rows="4"
            required
          ></textarea>

          <label className="mb-2 text-sm font-medium text-gray-300">
            Project Link
          </label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            type="url"
            placeholder="https://example.com"
            className="border border-gray-600 rounded-md p-2 mb-6 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-500 transition duration-200"
          >
            {loading ? "Adding Project..." : "Add Project"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-gray-400 underline hover:text-gray-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjects;
